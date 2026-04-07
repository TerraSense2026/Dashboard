import { useState, useEffect } from 'react';
import { fetchLiveData, GreenhouseMeasurement } from '@/lib/api';

export type { GreenhouseMeasurement } from '@/lib/api';

interface PlantLatestData {
  [plantName: string]: GreenhouseMeasurement;
}

export const useGreenhouseData = () => {
  const [data, setData] = useState<PlantLatestData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
        setError(null);
        const liveData = await fetchLiveData();
        if (cancelled) return;

        const latestByPlant: PlantLatestData = {};
        for (const plant of liveData.plants) {
          latestByPlant[plant.plant_name] = plant;
        }

        setData(latestByPlant);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    hydrate();
    const timer = setInterval(hydrate, 5000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return { data, loading, error };
};
