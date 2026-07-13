import { Outlet } from 'react-router-dom';
import { AppHeader } from '@/widgets/app-header/ui/AppHeader';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-800 to-navy-400">
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
