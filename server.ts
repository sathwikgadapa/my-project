import express from 'express';
import { createServer as createViteServer } from 'vite';
import db from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Get current user context (Simulated auth)
  app.get('/api/context', (req, res) => {
    // For demo purposes, we'll return hardcoded IDs or let the frontend pick
    res.json({
      restaurants: db.prepare('SELECT * FROM restaurants').all(),
      riders: db.prepare('SELECT * FROM riders').all(),
      ngos: db.prepare('SELECT * FROM ngos').all(),
    });
  });

  // 1. Restaurant: Post Excess Food
  app.post('/api/donations', (req, res) => {
    const { restaurantId, foodDescription, mealCount } = req.body;
    
    // Simple Algorithm: Find nearest NGO that needs food
    // For this demo, we'll just pick a random NGO that needs food
    const ngos = db.prepare('SELECT * FROM ngos WHERE needed_meals > 0').all() as any[];
    
    if (ngos.length === 0) {
      return res.status(404).json({ error: 'No NGOs currently need food.' });
    }

    // Sort by "distance" (simulated random choice for now, or simple math if we had real coords from client)
    const selectedNgo = ngos[0]; 

    const result = db.prepare(`
      INSERT INTO orders (restaurant_id, ngo_id, status, food_description, meal_count)
      VALUES (?, ?, 'pending', ?, ?)
    `).run(restaurantId, selectedNgo.id, foodDescription, mealCount);

    // Update NGO needs
    db.prepare('UPDATE ngos SET needed_meals = needed_meals - ? WHERE id = ?')
      .run(Math.min(selectedNgo.needed_meals, mealCount), selectedNgo.id);

    res.json({ success: true, orderId: result.lastInsertRowid, assignedNgo: selectedNgo });
  });

  // 2. Rider: Get Available Orders
  app.get('/api/orders/available', (req, res) => {
    const orders = db.prepare(`
      SELECT o.*, r.name as restaurant_name, r.address as restaurant_address, n.name as ngo_name, n.address as ngo_address
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      JOIN ngos n ON o.ngo_id = n.id
      WHERE o.status = 'pending'
    `).all();
    res.json(orders);
  });

  // 3. Rider: Get My Active Orders
  app.get('/api/orders/rider/:riderId', (req, res) => {
    const { riderId } = req.params;
    const orders = db.prepare(`
      SELECT o.*, r.name as restaurant_name, r.address as restaurant_address, n.name as ngo_name, n.address as ngo_address
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      JOIN ngos n ON o.ngo_id = n.id
      WHERE o.rider_id = ? AND o.status IN ('assigned', 'picked_up')
    `).all(riderId);
    res.json(orders);
  });

  // 4. Rider: Accept Order
  app.post('/api/orders/:orderId/accept', (req, res) => {
    const { orderId } = req.params;
    const { riderId } = req.body;

    const info = db.prepare('UPDATE orders SET status = ?, rider_id = ? WHERE id = ? AND status = ?')
      .run('assigned', riderId, orderId, 'pending');

    if (info.changes === 0) {
      return res.status(400).json({ error: 'Order already taken or not found' });
    }
    res.json({ success: true });
  });

  // 5. Rider: Update Status (Pick up / Deliver)
  app.post('/api/orders/:orderId/status', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body; // 'picked_up' or 'delivered'

    if (!['picked_up', 'delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);

    if (status === 'delivered') {
        // Add earnings (Simulated: 50 rupees per order)
        const order = db.prepare('SELECT rider_id FROM orders WHERE id = ?').get(orderId) as any;
        if (order) {
            db.prepare('UPDATE riders SET earnings = earnings + 50 WHERE id = ?').run(order.rider_id);
        }
    }

    res.json({ success: true });
  });

  // 6. Restaurant: Get My Donations
  app.get('/api/restaurants/:id/donations', (req, res) => {
    const { id } = req.params;
    const donations = db.prepare(`
      SELECT o.*, n.name as ngo_name, rid.name as rider_name
      FROM orders o
      LEFT JOIN ngos n ON o.ngo_id = n.id
      LEFT JOIN riders rid ON o.rider_id = rid.id
      WHERE o.restaurant_id = ?
      ORDER BY o.created_at DESC
    `).all(id);
    res.json(donations);
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
