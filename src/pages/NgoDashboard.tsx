import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card, Badge } from '@/components/ui';
import { Heart, Clock, CheckCircle, Truck, ArrowLeft } from 'lucide-react';
import { useData, Order } from '@/lib/api';

export default function NgoDashboard() {
  const { loading } = useData();
  const [incomingDonations, setIncomingDonations] = useState<Order[]>([]);

  useEffect(() => {
    // In a real app, we'd filter by NGO ID. For demo, we show all orders destined for NGOs.
    const fetchIncoming = () => {
      fetch('/api/orders/available') // Reusing available for now, but ideally need a specific endpoint
        .then(res => res.json())
        .then(data => {
            // Filter locally for demo purposes if needed, or just show all
            setIncomingDonations(data);
        });
    };
    
    fetchIncoming();
    const interval = setInterval(fetchIncoming, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-emerald-50 pb-20">
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 text-white p-1.5 rounded-lg">
              <Heart size={20} />
            </div>
            <h1 className="font-bold text-xl text-gray-900">NGO Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Incoming Donations</h2>
          <p className="text-gray-500">Track food being sent to your organization.</p>
        </div>

        <div className="grid gap-4">
          {incomingDonations.length === 0 ? (
            <Card className="p-12 text-center text-gray-400">
              <Heart className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No incoming donations at the moment.</p>
            </Card>
          ) : (
            incomingDonations.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="success">Incoming</Badge>
                      <span className="text-sm text-gray-500">{new Date(order.created_at).toLocaleTimeString()}</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{order.restaurant_name}</h3>
                    <p className="text-gray-600">{order.food_description} ({order.meal_count} meals)</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-emerald-600 font-medium">
                      <Truck size={18} />
                      {order.status === 'pending' ? 'Looking for Rider' : 'Rider Assigned'}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
