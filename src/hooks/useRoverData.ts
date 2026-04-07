import { useState, useEffect } from 'react';
import { database, ref, onValue } from '@/lib/firebase';

export interface RoverStatus {
  timestamp: string;
  latitude: number;
  longitude: number;
  battery_level: number;
  water_tank_level: number;
  state: 'charging' | 'navigating' | 'off';
}

export const useRoverData = () => {
  const [data, setData] = useState<RoverStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const roverRef = ref(database, 'rover_status');
      
      // Listen to real-time updates
      const unsubscribe = onValue(
        roverRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const allData = snapshot.val();
            
            // Find the most recent entry based on timestamp
            let latestRoverData: RoverStatus | null = null;
            let latestTimestamp: Date | null = null;

            Object.entries(allData).forEach(([key, value]: [string, any]) => {
              const timestamp = new Date(value.timestamp);
              if (!latestTimestamp || timestamp > latestTimestamp) {
                latestTimestamp = timestamp;
                latestRoverData = {
                  timestamp: value.timestamp,
                  latitude: value.latitude,
                  longitude: value.longitude,
                  battery_level: value.battery_level,
                  water_tank_level: value.water_tank_level,
                  state: value.state,
                };
              }
            });

            if (latestRoverData) {
              setData(latestRoverData);
            } else {
              setError('No rover data found');
            }
            setLoading(false);
          } else {
            setError('No rover status data available');
            setLoading(false);
          }
        },
        (error) => {
          setError(error.message);
          setLoading(false);
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
};
