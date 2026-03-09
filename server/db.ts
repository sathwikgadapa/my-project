import Database from 'better-sqlite3';

const db = new Database('food_rescue.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    lat REAL,
    lng REAL
  );

  CREATE TABLE IF NOT EXISTS ngos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    needed_meals INTEGER DEFAULT 50,
    lat REAL,
    lng REAL
  );

  CREATE TABLE IF NOT EXISTS riders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'offline', -- offline, available, busy
    lat REAL,
    lng REAL,
    earnings REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER,
    ngo_id INTEGER,
    rider_id INTEGER,
    status TEXT DEFAULT 'pending', -- pending, assigned, picked_up, delivered
    food_description TEXT,
    meal_count INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY(ngo_id) REFERENCES ngos(id),
    FOREIGN KEY(rider_id) REFERENCES riders(id)
  );
`);

// Seed some data if empty
const stmt = db.prepare('SELECT count(*) as count FROM restaurants');
const row = stmt.get() as { count: number };

if (row.count === 0) {
  console.log('Seeding database...');
  
  // Seed Restaurants
  const insertRest = db.prepare('INSERT INTO restaurants (name, address, lat, lng) VALUES (?, ?, ?, ?)');
  insertRest.run('Spice Garden', '123 MG Road, Indiranagar, Bangalore', 12.9716, 77.5946);
  insertRest.run('Tandoori Nights', '45 100ft Road, Koramangala, Bangalore', 12.9352, 77.6245);
  insertRest.run('Curry House', '88 Brigade Road, Bangalore', 12.9698, 77.6080);

  // Seed NGOs
  const insertNgo = db.prepare('INSERT INTO ngos (name, address, needed_meals, lat, lng) VALUES (?, ?, ?, ?, ?)');
  insertNgo.run('Hope Foundation', '12 Wilson Garden, Bangalore', 100, 12.9489, 77.5966);
  insertNgo.run('Little Hearts Orphanage', '34 Jayanagar 4th Block, Bangalore', 50, 12.9250, 77.5840);
  insertNgo.run('Senior Care Home', '56 Ulsoor Lake Road, Bangalore', 30, 12.9820, 77.6190);

  // Seed Riders
  const insertRider = db.prepare('INSERT INTO riders (name, phone, status, lat, lng) VALUES (?, ?, ?, ?, ?)');
  insertRider.run('Rahul Kumar', '9876543210', 'available', 12.9700, 77.5900);
  insertRider.run('Vikram Singh', '9876543211', 'available', 12.9300, 77.6200);
}

export default db;
