import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSessionStore, type UserRole } from '@/entities/user';

export function RequireRole({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  const currentUser = useSessionStore((s) => s.currentUser);

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'specialist' ? '/specialist' : '/profile'} replace />;
  }

  return <>{children}</>;
}
