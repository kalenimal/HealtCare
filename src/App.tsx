import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/app/providers/AppLayout';
import { RequireRole } from '@/app/providers/RequireRole';
import { RootRedirect } from '@/app/providers/RootRedirect';
import { AuthPage } from '@/pages/auth/ui/AuthPage';

const ProfilePage = lazy(() =>
  import('@/pages/profile/ui/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const HealthStatsPage = lazy(() =>
  import('@/pages/health-stats/ui/HealthStatsPage').then((m) => ({ default: m.HealthStatsPage })),
);
const SpecialistDashboardPage = lazy(() =>
  import('@/pages/specialist-dashboard/ui/SpecialistDashboardPage').then((m) => ({
    default: m.SpecialistDashboardPage,
  })),
);
const SpecialistParticipantPage = lazy(() =>
  import('@/pages/specialist-participant/ui/SpecialistParticipantPage').then((m) => ({
    default: m.SpecialistParticipantPage,
  })),
);
const SpecialistReportsPage = lazy(() =>
  import('@/pages/specialist-reports/ui/SpecialistReportsPage').then((m) => ({
    default: m.SpecialistReportsPage,
  })),
);

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-sm text-navy-800/50">
      Загрузка…
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<AppLayout />}>
          <Route
            path="/profile"
            element={
              <RequireRole role="patient">
                <ProfilePage />
              </RequireRole>
            }
          />
          <Route
            path="/health-stats"
            element={
              <RequireRole role="patient">
                <HealthStatsPage />
              </RequireRole>
            }
          />

          <Route
            path="/specialist"
            element={
              <RequireRole role="specialist">
                <SpecialistDashboardPage />
              </RequireRole>
            }
          />
          <Route
            path="/specialist/participants/:patientId"
            element={
              <RequireRole role="specialist">
                <SpecialistParticipantPage />
              </RequireRole>
            }
          />
          <Route
            path="/specialist/reports"
            element={
              <RequireRole role="specialist">
                <SpecialistReportsPage />
              </RequireRole>
            }
          />
        </Route>

        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </Suspense>
  );
}

export default App;
