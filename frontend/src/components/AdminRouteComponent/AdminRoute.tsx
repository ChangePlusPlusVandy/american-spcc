import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const isAdmin = user?.publicMetadata?.role === 'ADMIN';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
