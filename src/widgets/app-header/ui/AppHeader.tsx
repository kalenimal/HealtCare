import { fullName, useSessionStore } from '@/entities/user';
import sechenovLogo from '@/shared/assets/sechenov-logo.png';
import { Avatar } from '@/shared/ui/Avatar';
import { Button } from '@/shared/ui/Button';
import clsx from 'clsx';
import { NavLink, useNavigate } from 'react-router-dom';

const patientLinks = [
  { to: '/profile', label: 'Профиль' },
  { to: '/health-stats', label: 'Показатели здоровья' },
];

const specialistLinks = [
  { to: '/specialist', label: 'Сигналы' },
  { to: '/specialist/reports', label: 'Отчёты по группам' },
];

export function AppHeader() {
  const navigate = useNavigate();
  const currentUser = useSessionStore((s) => s.currentUser);
  const logout = useSessionStore((s) => s.logout);

  if (!currentUser) return null;

  const links = currentUser.role === 'specialist' ? specialistLinks : patientLinks;

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="border-b border-navy-400/20 bg-mist-100">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img src={sechenovLogo} alt="Сеченовский Университет" className="h-8 w-auto" />
      
        </div>

        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                clsx(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-navy-800 text-mist-100'
                    : 'text-navy-800 hover:bg-navy-400/10',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-navy-950">{fullName(currentUser)}</p>
            <p className="text-xs text-navy-800/60">
              {currentUser.role === 'specialist' ? 'Специалист' : 'Пациент'}
            </p>
          </div>
          <Avatar name={fullName(currentUser)} size={36} />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
}
