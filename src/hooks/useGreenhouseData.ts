import { useState, useEffect } from 'react';
import { database, ref, onValue, limitToLast, query, orderByChild } from '@/lib/firebase';

export interface GreenhouseMeasurement {
  timestamp: string;
  plant_name: string;
  humidity: number;
  temperature: number;
  optimal_humidity: number;
  soil_moisture: number;
  optimal_soil_moisture: number;
  last_watered: string;
  status: 'normal' | 'warning';
}

interface PlantLatestData {
  [plantName: string]: GreenhouseMeasurement;
}

export const useGreenhouseData = () => {
  const [data, setData] = useState<PlantLatestData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const measurementsRef = ref(database, 'greenhouse_measurements');
      
      // Listen to real-time updates
      const unsubscribe = onValue(
        measurementsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const allData = snapshot.val();
            const latestByPlant: PlantLatestData = {};

            // Group measurements by plant and keep only the latest for each
            Object.entries(allData).forEach(([key, value]: [string, any]) => {
              const plantName = value.plant_name;
              
              // Keep the measurement if it's newer than what we have
              if (
                !latestByPlant[plantName] ||
                new Date(value.timestamp) > new Date(latestByPlant[plantName].timestamp)
              ) {
                latestByPlant[plantName] = {
                  timestamp: value.timestamp,
                  plant_name: value.plant_name,
                  humidity: value.humidity,
                  temperature: value.temperature,
                  optimal_humidity: value.optimal_humidity,
                  soil_moisture: value.soil_moisture,
                  optimal_soil_moisture: value.optimal_soil_moisture,
                  last_watered: value.last_watered,
                  status: value.status,
                };
              }
            });

            setData(latestByPlant);
            setLoading(false);
          } else {
            setError('No data found');
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
