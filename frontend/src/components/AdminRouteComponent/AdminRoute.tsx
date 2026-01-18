import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function AdminRoute() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const isAdmin =
    user?.publicMetadata?.role === 'ADMIN' ||
    user?.publicMetadata?.role === 'SUPER_ADMIN';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
