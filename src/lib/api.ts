import { useEffect, useState } from 'react';

export interface Restaurant {
  id: number;
  name: string;
  address: string;
}

export interface Rider {
  id: number;
  name: string;
  status: string;
  earnings: number;
}

export interface Order {
  id: number;
  restaurant_id: number;
  ngo_id: number;
  rider_id: number | null;
  status: 'pending' | 'assigned' | 'picked_up' | 'delivered';
  food_description: string;
  meal_count: number;
  restaurant_name: string;
  restaurant_address: string;
  ngo_name: string;
  ngo_address: string;
  created_at: string;
}

export function useData() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/context')
      .then(res => res.json())
      .then(data => {
        setRestaurants(data.restaurants);
        setRiders(data.riders);
        setLoading(false);
      });
  }, []);

  return { restaurants, riders, loading };
}
