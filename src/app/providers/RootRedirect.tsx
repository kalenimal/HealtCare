import { Navigate } from 'react-router-dom';
import { useSessionStore } from '@/entities/user';

export function RootRedirect() {
  const currentUser = useSessionStore((s) => s.currentUser);

  if (!currentUser) return <Navigate to="/auth" replace />;
  return (
    <Navigate to={currentUser.role === 'specialist' ? '/specialist' : '/profile'} replace />
  );
}
