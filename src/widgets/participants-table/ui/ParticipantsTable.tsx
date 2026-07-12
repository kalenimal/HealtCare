import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { fullName, type User } from '@/entities/user';
import { useSignalStore } from '@/entities/signal';

export function ParticipantsTable({ patients }: { patients: User[] }) {
  const navigate = useNavigate();
  const signals = useSignalStore((s) => s.signals);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-navy-400/20 text-left text-navy-800/60">
            <th className="py-2 pr-3 font-medium">Участник</th>
            <th className="py-2 pr-3 font-medium">Организация</th>
            <th className="py-2 pr-3 font-medium">Возраст</th>
            <th className="py-2 pr-3 font-medium">Статус</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => {
            const activeCount = signals.filter(
              (s) => s.patientId === patient.id && s.status === 'new',
            ).length;
            return (
              <tr
                key={patient.id}
                onClick={() => navigate(`/specialist/participants/${patient.id}`)}
                className="cursor-pointer border-b border-navy-400/10 transition-colors hover:bg-navy-400/5"
              >
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={fullName(patient)} size={30} />
                    <span className="font-medium text-navy-950">{fullName(patient)}</span>
                  </div>
                </td>
                <td className="py-2.5 pr-3 text-navy-950/80">{patient.organization}</td>
                <td className="py-2.5 pr-3 text-navy-950/80">{patient.vitals.age}</td>
                <td className="py-2.5 pr-3">
                  {activeCount > 0 ? (
                    <Badge tone="warning">{activeCount} сигнал(ов)</Badge>
                  ) : (
                    <Badge tone="success">В норме</Badge>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
