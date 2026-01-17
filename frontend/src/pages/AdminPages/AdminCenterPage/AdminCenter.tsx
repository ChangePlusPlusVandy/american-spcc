import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { API_BASE_URL } from '@/config/api';
import './AdminCenter.css';
import { useUser } from '@clerk/clerk-react';

type Tab = 'profile' | 'content' | 'analytics';

type User = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'PARENT' | 'ADMIN' | 'SUPER_ADMIN';
};

export default function AdminCenter() {
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const isAdmin =
  isLoaded &&
  (user?.publicMetadata?.role === 'ADMIN' ||
   user?.publicMetadata?.role === 'SUPER_ADMIN');



  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data: User = await res.json();

        setDbUser(data);

      } catch (err) {
        console.error('Failed to load admin:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  if (!isLoaded) return null;

  if (!isAdmin) {
    return <div className="admin-page">Access denied</div>;
  }
  
  if (loading || !dbUser) {
    return <div className="admin-page">Loading admin dashboard…</div>;
  }

  return (
    <div className="admin-page">
      <h2 className="admin-title">Admin Center</h2>
      <div className="admin-row">
        <aside className="admin-card">
          <div className="admin-info">
            <div className="admin-avatar">
            {isLoaded && user && (
                <img
                    src={user.imageUrl}
                    alt="Admin avatar"
                    className="admin-avatar-image"
                />
                )}

            </div>
            <div>
            <div className="admin-name">
              {dbUser.first_name} {dbUser.last_name}
            </div>
            <div className="admin-email">{dbUser.email}</div>
            </div>
          </div>

          <button
            className={`admin-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Admin Profile
          </button>

          <button
            className={`admin-btn ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            Content Management
          </button>

          <button
            className={`admin-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Data Analytics
          </button>
        </aside>
        <main className="admin-panel">
          {activeTab === 'profile' && <h3>Admin Profile</h3>}
          {activeTab === 'content' && <h3>Content Management</h3>}
          {activeTab === 'analytics' && <h3>Data Analytics</h3>}
        </main>
      </div>
    </div>
  );
}
