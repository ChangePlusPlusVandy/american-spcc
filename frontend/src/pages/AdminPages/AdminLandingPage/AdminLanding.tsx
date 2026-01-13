import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { API_BASE_URL } from '@/config/api';
import './AdminLanding.css';
import { useUser } from '@clerk/clerk-react';

type Tab = 'profile' | 'content' | 'analytics';

type Admin = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  is_active: boolean;
};

export default function AdminLanding() {
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();


  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/admin/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Not an admin');

        const data = await res.json();
        setAdmin(data);
      } catch (err) {
        console.error('Failed to load admin:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  if (loading) {
    return <div className="admin-page">Loading admin dashboard…</div>;
  }

  if (!admin) {
    return <div className="admin-page">Access denied</div>;
  }

  return (
    <div className="admin-page">
      <h2 className="admin-title">Admin Center</h2>

      <div className="admin-row">
        {/* LEFT CARD */}
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
              <div className="admin-name">{admin.full_name}</div>
              <div className="admin-email">{admin.email}</div>
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

        {/* RIGHT CARD */}
        <main className="admin-panel">
          {activeTab === 'profile' && <h3>Admin Profile</h3>}
          {activeTab === 'content' && <h3>Content Management</h3>}
          {activeTab === 'analytics' && <h3>Data Analytics</h3>}
        </main>
      </div>
    </div>
  );
}
