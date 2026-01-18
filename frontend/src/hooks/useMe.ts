import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { API_BASE_URL } from '@/config/api';

type MeResponse = { role: 'ADMIN'; admin: any } | { role: 'PARENT'; parent: any };

export function useMe() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setLoading(false);
      return;
    }

    const fetchMe = async () => {
      try {
        const token = await getToken();
        console.log('CLERK TOKEN:', token);

        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch me');
        const data = await res.json();
        setMe(data);
      } catch (err) {
        console.error('useMe error:', err);
        setMe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [isLoaded, isSignedIn]);

  return { me, loading };
}
