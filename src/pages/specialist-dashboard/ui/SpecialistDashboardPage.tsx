import { PageContainer } from '@/shared/ui/PageContainer';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { mockPatients } from '@/entities/user';
import { useSignalStore } from '@/entities/signal';
import { SignalsList } from '@/widgets/signals-list/ui/SignalsList';
import { ParticipantsTable } from '@/widgets/participants-table/ui/ParticipantsTable';

export function SpecialistDashboardPage() {
  const signals = useSignalStore((s) => s.signals);
  const activeSignals = signals
    .filter((s) => s.status === 'new')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold text-mist-100">Кабинет специалиста</h1>
          <p className="text-sm text-mist-100/70">
            Сигналы внимания по участникам и общий обзор группы наблюдения
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-navy-950">
              Сигналы внимания{' '}
              <span className="ml-1 text-sm font-normal text-navy-800/50">
                ({activeSignals.length})
              </span>
            </h2>
          </CardHeader>
          <CardBody>
            <SignalsList signals={activeSignals} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-navy-950">Все участники</h2>
          </CardHeader>
          <CardBody>
            <ParticipantsTable patients={mockPatients} />
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}
