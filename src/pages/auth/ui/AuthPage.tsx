import { AuthForm } from '@/features/auth-form/ui/AuthForm';
import { Card, CardBody } from '@/shared/ui/Card';
import sechenovLogo from '@/shared/assets/sechenov-logo.png';

export function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-y-auto bg-gradient-to-br from-navy-950 via-navy-800 to-navy-400 px-4 py-6">
      <div className="w-full max-w-md">
        <div className="mb-5 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-4 rounded-2xl bg-mist-100/95 px-5 py-3 shadow-lg">
            <img src={sechenovLogo} alt="Сеченовский Университет" className="h-10 w-auto" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-mist-100">Здоровьесбережение</h1>
            <p className="mt-1 text-sm text-mist-100/70">
              Платформа мониторинга показателей здоровья
            </p>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardBody>
            <AuthForm />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
