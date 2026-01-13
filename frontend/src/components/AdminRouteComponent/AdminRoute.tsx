import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAdminMe } from '@/hooks/useAdminMe';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { me, loading } = useAdminMe();

  if (loading) return null;

  if (!me) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
