import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { API_BASE_URL } from '@/config/api';

export function useAdminMe() {
  const { getToken } = useAuth();
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error('No token');

        const res = await fetch(`${API_BASE_URL}/api/admin/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setMe(null);
          return;
        }

        const data = await res.json();
        setMe(data);
      } catch {
        setMe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [getToken]);

  return { me, loading };
}
