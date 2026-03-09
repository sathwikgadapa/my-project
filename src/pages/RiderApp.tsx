import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '@/components/ui';
import { MapPin, Navigation, Phone, CheckCircle, Package, User, DollarSign, RefreshCw, ArrowLeft } from 'lucide-react';
import { useData, Order } from '@/lib/api';

export default function RiderApp() {
  const { riders, loading } = useData();
  const [currentRiderId, setCurrentRiderId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'active'>('available');
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    if (riders.length > 0 && !currentRiderId) {
      setCurrentRiderId(riders[0].id);
      setEarnings(riders[0].earnings);
    }
  }, [riders]);

  useEffect(() => {
    if (!currentRiderId) return;
    
    // Update local earnings display
    const rider = riders.find(r => r.id === currentRiderId);
    if (rider) setEarnings(rider.earnings);

    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [currentRiderId, activeTab]);

  const fetchOrders = () => {
    if (!currentRiderId) return;

    // Fetch available
    fetch('/api/orders/available')
      .then(res => res.json())
      .then(setAvailableOrders);

    // Fetch my active
    fetch(`/api/orders/rider/${currentRiderId}`)
      .then(res => res.json())
      .then(setMyOrders);
  };

  const acceptOrder = async (orderId: number) => {
    await fetch(`/api/orders/${orderId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ riderId: currentRiderId }),
    });
    fetchOrders();
    setActiveTab('active');
  };

  const updateStatus = async (orderId: number, status: 'picked_up' | 'delivered') => {
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    
    if (status === 'delivered') {
      setEarnings(prev => prev + 50);
    }
    fetchOrders();
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading App...</div>;

  return (
    <div className="min-h-screen bg-gray-100 pb-20 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Mobile Header */}
      <header className="bg-red-600 text-white p-4 pt-8 sticky top-0 z-20 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-1 hover:bg-red-700 rounded-full transition-colors text-red-100">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-bold text-lg">Annapurna Delivery</h1>
              <div className="flex items-center gap-1 text-red-100 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Online
              </div>
            </div>
          </div>
          <select 
            className="bg-red-700 text-white border-none rounded-lg text-xs px-2 py-1"
            value={currentRiderId || ''}
            onChange={(e) => setCurrentRiderId(Number(e.target.value))}
          >
            {riders.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Earnings Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-xs text-red-100">Today's Earnings</p>
              <p className="font-bold text-lg">₹{earnings}</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 h-8">
            History
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex p-2 gap-2 bg-white sticky top-[136px] z-10 shadow-sm">
        <button 
          onClick={() => setActiveTab('available')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'available' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}
        >
          New Orders ({availableOrders.length})
        </button>
        <button 
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'active' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}
        >
          Active ({myOrders.length})
        </button>
      </div>

      <main className="p-4 space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === 'available' ? (
            <motion.div 
              key="available"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {availableOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <RefreshCw className="mx-auto mb-2 animate-spin-slow" />
                  <p>Scanning for nearby orders...</p>
                </div>
              ) : (
                availableOrders.map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    action={
                      <Button onClick={() => acceptOrder(order.id)} className="w-full bg-green-600 hover:bg-green-700">
                        Accept Delivery
                      </Button>
                    }
                  />
                ))
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="active"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {myOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Package className="mx-auto mb-2" />
                  <p>No active deliveries.</p>
                </div>
              ) : (
                myOrders.map(order => (
                  <ActiveOrderCard 
                    key={order.id} 
                    order={order} 
                    onUpdateStatus={updateStatus}
                  />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const OrderCard: React.FC<{ order: Order, action: React.ReactNode }> = ({ order, action }) => {
  return (
    <Card className="p-4 border-l-4 border-l-red-500">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-900">{order.restaurant_name}</h3>
          <p className="text-xs text-gray-500 truncate max-w-[200px]">{order.restaurant_address}</p>
        </div>
        <Badge variant="warning">₹50</Badge>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 min-w-[16px]"><Package size={16} className="text-gray-400" /></div>
          <div>
            <p className="text-sm font-medium text-gray-700">{order.food_description}</p>
            <p className="text-xs text-gray-500">{order.meal_count} meals</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 min-w-[16px]"><MapPin size={16} className="text-gray-400" /></div>
          <div>
            <p className="text-sm font-medium text-gray-700">To: {order.ngo_name}</p>
            <p className="text-xs text-gray-500 truncate max-w-[200px]">{order.ngo_address}</p>
          </div>
        </div>
      </div>
      {action}
    </Card>
  );
}

const ActiveOrderCard: React.FC<{ order: Order, onUpdateStatus: (id: number, status: 'picked_up' | 'delivered') => void }> = ({ order, onUpdateStatus }) => {
  const isPickedUp = order.status === 'picked_up';

  return (
    <Card className="p-0 overflow-hidden border-none shadow-lg">
      {/* Map Placeholder */}
      <div className="h-32 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-slate-100">
          <MapPin className="animate-bounce text-red-500" />
          <span className="ml-2 text-xs font-mono">Simulated Map View</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Badge variant={isPickedUp ? "neutral" : "warning"}>
            {isPickedUp ? 'Heading to Drop' : 'Heading to Pickup'}
          </Badge>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
              <Phone size={14} />
            </Button>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
              <Navigation size={14} />
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-lg mb-1">
            {isPickedUp ? order.ngo_name : order.restaurant_name}
          </h3>
          <p className="text-sm text-gray-500">
            {isPickedUp ? order.ngo_address : order.restaurant_address}
          </p>
        </div>

        {isPickedUp ? (
          <Button 
            onClick={() => onUpdateStatus(order.id, 'delivered')}
            className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
          >
            <CheckCircle className="mr-2" size={20} />
            Mark Delivered
          </Button>
        ) : (
          <Button 
            onClick={() => onUpdateStatus(order.id, 'picked_up')}
            className="w-full h-12 text-lg"
          >
            <Package className="mr-2" size={20} />
            Confirm Pickup
          </Button>
        )}
      </div>
    </Card>
  );
}
