import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { delay } from '@/shared/lib/delay';
import { mockPatients, mockSpecialist, useSessionStore, type UserRole } from '@/entities/user';
import { RoleSwitch } from './RoleSwitch';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export function AuthForm() {
  const navigate = useNavigate();
  const login = useSessionStore((s) => s.login);

  const [role, setRole] = useState<UserRole>('patient');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await delay(500);

    const mockUser = role === 'specialist' ? mockSpecialist : mockPatients[0];
    login({
      ...mockUser,
      lastName: lastName.trim() || mockUser.lastName,
      firstName: firstName.trim() || mockUser.firstName,
      patronymic: patronymic.trim() || mockUser.patronymic,
      phone: phone.trim() || mockUser.phone,
    });

    setLoading(false);
    navigate(role === 'specialist' ? '/specialist' : '/profile');
  };

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <RoleSwitch value={role} onChange={setRole} />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            id="lastName"
            label="Фамилия"
            placeholder="Иванова"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <Input
            id="firstName"
            label="Имя"
            placeholder="Мария"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            id="patronymic"
            label="Отчество"
            placeholder="Сергеевна"
            value={patronymic}
            onChange={(e) => setPatronymic(e.target.value)}
          />
        </div>

        <Input
          id="phone"
          label="Номер телефона"
          type="tel"
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <Input
          id="password"
          label="Пароль"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-navy-950">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-navy-400/40 text-navy-800 accent-navy-800 focus:ring-2 focus:ring-navy-800/15"
            />
            Запомнить меня
          </label>
          <button
            type="button"
            onClick={() => setForgotOpen(true)}
            className="cursor-pointer text-sm font-medium text-navy-800 hover:underline"
          >
            Забыли пароль?
          </button>
        </div>

        <Button type="submit" size="lg" disabled={loading}>
          {loading ? 'Выполняется вход…' : 'Войти'}
        </Button>

        <p className="text-center text-xs text-navy-950/50">
          Это демонстрационная заглушка авторизации — данные не проверяются и не
          передаются на сервер.
        </p>
      </form>

      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </>
  );
}
