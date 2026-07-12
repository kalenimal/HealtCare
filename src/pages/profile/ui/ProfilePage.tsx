import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/shared/ui/PageContainer';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { useSessionStore, fullName } from '@/entities/user';
import { ProfileEditModal } from '@/features/profile-edit/ui/ProfileEditModal';
import { VitalsEditModal } from '@/features/vitals-edit/ui/VitalsEditModal';
import { StubModal } from '@/shared/ui/StubModal';

function bmi(heightCm: number, weightKg: number) {
  const meters = heightCm / 100;
  return Math.round((weightKg / (meters * meters)) * 10) / 10;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const currentUser = useSessionStore((s) => s.currentUser);
  const logout = useSessionStore((s) => s.logout);
  const [editOpen, setEditOpen] = useState(false);
  const [vitalsOpen, setVitalsOpen] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [doctorOpen, setDoctorOpen] = useState(false);

  if (!currentUser) return null;

  const infoRows = [
    { label: 'Телефон', value: currentUser.phone },
    { label: 'Электронная почта', value: currentUser.email },
    { label: 'Организация', value: currentUser.organization },
  ];

  const vitalsRows = [
    { label: 'Рост', value: `${currentUser.vitals.heightCm} см` },
    { label: 'Вес', value: `${currentUser.vitals.weightKg} кг` },
    { label: 'Возраст', value: `${currentUser.vitals.age} лет` },
    { label: 'ИМТ', value: `${bmi(currentUser.vitals.heightCm, currentUser.vitals.weightKg)}` },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <Card>
          <CardBody className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={fullName(currentUser)} size={72} />
              <div>
                <h1 className="text-xl font-semibold text-navy-950">
                  {fullName(currentUser)}
                </h1>
                <div className="mt-1">
                  <Badge tone="info">
                    {currentUser.role === 'specialist' ? 'Специалист' : 'Пациент'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => setEditOpen(true)}>
                Редактировать профиль
              </Button>
              <Button variant="secondary" onClick={() => setVitalsOpen(true)}>
                Уточняющие данные
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-navy-950">Личные данные</h2>
            </CardHeader>
            <CardBody className="flex flex-col gap-3">
              {infoRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-navy-800/70">{row.label}</span>
                  <span className="font-medium text-navy-950">{row.value}</span>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold text-navy-950">Статичные данные</h2>
            </CardHeader>
            <CardBody className="flex flex-col gap-3">
              {vitalsRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-navy-800/70">{row.label}</span>
                  <span className="font-medium text-navy-950">{row.value}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <Card className="bg-navy-950 text-mist-100">
          <CardBody className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h2 className="font-semibold">Что дальше?</h2>
              <p className="mt-1 text-sm text-mist-100/70">
                Пройдите опрос о самочувствии или обратитесь к врачу для консультации.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="secondary" onClick={() => setSurveyOpen(true)}>
                Пройти опрос
              </Button>
              <Button onClick={() => setDoctorOpen(true)}>Обратиться к врачу</Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <ProfileEditModal open={editOpen} onClose={() => setEditOpen(false)} />
      <VitalsEditModal open={vitalsOpen} onClose={() => setVitalsOpen(false)} />
      <StubModal
        open={surveyOpen}
        onClose={() => setSurveyOpen(false)}
        title="Опрос о самочувствии"
        text="Заглушка: здесь будет короткий опросник о самочувствии, по итогам которого обновятся ваши показатели здоровья."
      />
      <StubModal
        open={doctorOpen}
        onClose={() => setDoctorOpen(false)}
        title="Обращение к врачу"
        text="Заглушка: заявка на консультацию отправлена. В реальном приложении здесь будет запись на приём к специалисту."
      />
    </PageContainer>
  );
}
