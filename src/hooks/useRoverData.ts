import { useState, useEffect } from 'react';
import { fetchLiveData, RoverStatus } from '@/lib/api';

export type { RoverStatus } from '@/lib/api';

export const useRoverData = () => {
  const [data, setData] = useState<RoverStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
        setError(null);
        const liveData = await fetchLiveData();
        if (cancelled) return;

        if (liveData.roverStatus) {
          setData(liveData.roverStatus);
        } else {
          setError('No rover status data available');
        }
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
