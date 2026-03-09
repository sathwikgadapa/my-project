import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Bike, Heart, Activity } from 'lucide-react';
import { Order } from '@/lib/api';

export default function LandingPage() {
  const [recentDonations, setRecentDonations] = useState<Order[]>([]);

  useEffect(() => {
    // Poll for recent donations (using the available orders API for now as a proxy for activity)
    const fetchActivity = () => {
      fetch('/api/orders/available')
        .then(res => res.json())
        .then(data => {
            // Just take the last few for display
            setRecentDonations(data.slice(0, 3));
        });
    };
    
    fetchActivity();
    const interval = setInterval(fetchActivity, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="font-bold text-2xl tracking-tighter text-red-600 flex items-center gap-2">
          <Heart className="fill-current" />
          Annapurna
        </div>
        <div className="text-sm font-medium text-gray-600 hidden sm:block">
          Bridging Hunger & Hope
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Hero Text */}
          <div className="text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Live Food Rescue Network
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                Don't waste food.<br/>
                <span className="text-red-600">Share it.</span>
              </h1>
              <p className="text-xl text-gray-500 mt-6 max-w-lg leading-relaxed">
                Connect your restaurant's excess food with local NGOs and shelters instantly. 
                Our network of riders ensures it reaches those in need while it's still fresh.
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-4">
              <Link to="/restaurant">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-red-600 text-white rounded-2xl font-semibold shadow-lg shadow-red-200 hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Utensils size={20} />
                  I'm a Restaurant
                </motion.button>
              </Link>
              <Link to="/rider">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-semibold hover:border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Bike size={20} />
                  I'm a Rider
                </motion.button>
              </Link>
            </div>
            
            <div className="mt-4">
                <Link to="/ngo" className="text-sm text-gray-400 hover:text-gray-600 underline decoration-gray-300 underline-offset-4">
                    Login as NGO / Charity Organization
                </Link>
            </div>
          </div>

          {/* Live Activity Feed / Visual */}
          <div className="relative h-[500px] bg-gray-50 rounded-[40px] border border-gray-100 p-8 overflow-hidden hidden lg:flex flex-col">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent z-10"></div>
            
            <div className="flex items-center justify-between mb-8 z-20 relative">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Activity size={18} className="text-emerald-500" />
                Live Activity
              </h3>
              <div className="text-xs text-gray-400 font-mono">REAL-TIME</div>
            </div>

            <div className="space-y-4 relative z-0">
              <AnimatePresence>
                {recentDonations.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20">Waiting for donations...</div>
                ) : (
                    recentDonations.map((order, i) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
                    >
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                        <Utensils size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{order.restaurant_name}</div>
                        <div className="text-sm text-gray-500 truncate">donated {order.meal_count} meals</div>
                        </div>
                        <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        Just now
                        </div>
                    </motion.div>
                    ))
                )}
              </AnimatePresence>
              
              {/* Mock items to fill space if empty */}
              {recentDonations.length < 3 && (
                <>
                    <div className="bg-white/50 p-4 rounded-2xl border border-gray-50 flex items-center gap-4 opacity-50">
                        <div className="w-10 h-10 rounded-full bg-gray-100"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                        </div>
                    </div>
                </>
              )}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
          </div>

        </div>
      </main>

      <footer className="p-6 text-center text-gray-400 text-sm border-t border-gray-100">
        © 2026 Annapurna Initiative. Made for India 🇮🇳
      </footer>
    </div>
  );
}
