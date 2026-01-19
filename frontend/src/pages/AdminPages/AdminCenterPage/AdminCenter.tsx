import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { API_BASE_URL } from '@/config/api';
import './AdminCenter.css';
import { useUser } from '@clerk/clerk-react';
import { NavLink, Outlet } from 'react-router-dom';
import { UserRoundCog, ListPlus, ChartPie } from 'lucide-react';

type User = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'PARENT' | 'ADMIN' | 'SUPER_ADMIN';
};

export default function AdminCenter() {
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const isAdmin =
    isLoaded &&
    (user?.publicMetadata?.role === 'ADMIN' || user?.publicMetadata?.role === 'SUPER_ADMIN');
  const fetchAdmin = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      if (!user) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/me`, {
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

  useEffect(() => {
    if (!isLoaded) return;
    if (!isAdmin) return;
  
    fetchAdmin();
  }, [isLoaded, isAdmin]);
  

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
              <div className="admin-avatar-border">
                {isLoaded && user && (
                  <img src={user.imageUrl} alt="Admin avatar" className="admin-avatar-image" />
                )}
              </div>
            </div>
            <div>
              <div className="admin-name">
                {dbUser.first_name} {dbUser.last_name}
              </div>
              <div className="admin-email-group">
                <p>Email:</p>
                <p className="admin-email">{dbUser.email}</p>
              </div>
            </div>
          </div>

          <NavLink
            to="/admin/admin-center/profile"
            className={({ isActive }) => `admin-btn ${isActive ? 'active' : ''} admin-tabs`}
          >
            <UserRoundCog className="mr-2 inline-block" /> Admin Profile
          </NavLink>

          <NavLink
            to="/admin/admin-center/content-management"
            className={({ isActive }) => `admin-btn ${isActive ? 'active' : ''} admin-tabs`}
          >
            <ListPlus className="mr-2 inline-block" /> Content Management
          </NavLink>

          <NavLink
            to="/admin/admin-center/data-analytics"
            className={({ isActive }) => `admin-btn ${isActive ? 'active' : ''} admin-tabs`}
          >
            <ChartPie className="mr-2 inline-block" /> Data Analytics
          </NavLink>
        </aside>
        <main className="admin-panel">
          <Outlet context={{ dbUser, loading, fetchAdmin }} />
        </main>
      </div>
    </div>
  );
}