import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '@/components/ui';
import { MapPin, Package, Clock, CheckCircle, Truck, Utensils, ArrowLeft } from 'lucide-react';
import { useData, Order } from '@/lib/api';

export default function RestaurantDashboard() {
  const { restaurants, loading } = useData();
  const [currentRestaurantId, setCurrentRestaurantId] = useState<number | null>(null);
  const [donations, setDonations] = useState<Order[]>([]);
  const [formData, setFormData] = useState({ description: '', count: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (restaurants.length > 0 && !currentRestaurantId) {
      setCurrentRestaurantId(restaurants[0].id);
    }
  }, [restaurants]);

  useEffect(() => {
    if (currentRestaurantId) {
      fetchDonations();
      const interval = setInterval(fetchDonations, 5000); // Poll for updates
      return () => clearInterval(interval);
    }
  }, [currentRestaurantId]);

  const fetchDonations = () => {
    if (!currentRestaurantId) return;
    fetch(`/api/restaurants/${currentRestaurantId}/donations`)
      .then(res => res.json())
      .then(setDonations);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRestaurantId) return;
    setSubmitting(true);

    try {
      await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: currentRestaurantId,
          foodDescription: formData.description,
          mealCount: parseInt(formData.count),
        }),
      });
      setFormData({ description: '', count: '' });
      fetchDonations();
    } catch (error) {
      console.error('Failed to donate', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-red-600 text-white p-1.5 rounded-lg">
                <Utensils size={20} />
              </div>
              <h1 className="font-bold text-xl text-gray-900">Partner Dashboard</h1>
            </div>
          </div>
          <select 
            className="bg-gray-100 border-none rounded-lg text-sm font-medium px-3 py-1.5"
            value={currentRestaurantId || ''}
            onChange={(e) => setCurrentRestaurantId(Number(e.target.value))}
          >
            {restaurants.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Donation Form */}
        <div className="md:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Donate Excess Food</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Description</label>
                <textarea 
                  required
                  className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all text-sm p-3"
                  placeholder="E.g., 20 servings of Rice and Dal"
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Servings Count</label>
                <input 
                  type="number"
                  required
                  min="1"
                  className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 transition-all text-sm p-3"
                  placeholder="Number of meals"
                  value={formData.count}
                  onChange={e => setFormData({...formData, count: e.target.value})}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={submitting}
              >
                {submitting ? 'Processing...' : 'Broadcast Availability'}
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Riders will be notified immediately.
              </p>
            </form>
          </Card>
        </div>

        {/* History / Status */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="font-semibold text-lg">Active & Past Donations</h2>
          
          {donations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
              <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No donations recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <motion.div 
                  key={donation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{donation.food_description}</span>
                        <span className="text-xs text-gray-500">({donation.meal_count} meals)</span>
                      </div>
                      <div className="flex flex-col gap-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          <span>To: {donation.ngo_name || 'Assigning...'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          <span>{new Date(donation.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      {donation.rider_id && (
                        <div className="text-right mr-2">
                          <div className="text-xs font-medium text-gray-900">Rider: {donation.rider_id}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Assigned</div>
                        </div>
                      )}
                      <StatusBadge status={donation.status} />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'pending':
      return <Badge variant="warning">Finding Rider</Badge>;
    case 'assigned':
      return <Badge variant="neutral">Rider Assigned</Badge>;
    case 'picked_up':
      return <Badge variant="neutral">On the Way</Badge>;
    case 'delivered':
      return <Badge variant="success">Delivered</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}
