import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { delay } from '@/shared/lib/delay';

export function ForgotPasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await delay(600);
    setLoading(false);
    setSent(true);
  };

  const handleClose = () => {
    onClose();
    setSent(false);
    setPhone('');
  };

  return (
    <Modal open={open} onClose={handleClose} title="Восстановление пароля">
      {sent ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-navy-950/80">
            Заглушка: инструкция по восстановлению пароля «отправлена» на номер{' '}
            <span className="font-medium">{phone || 'не указан'}</span>. В реальном
            приложении здесь будет SMS с кодом подтверждения.
          </p>
          <Button onClick={handleClose}>Понятно</Button>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <p className="text-sm text-navy-950/70">
            Введите номер телефона, привязанный к аккаунту — мы пришлём инструкцию по
            восстановлению доступа.
          </p>
          <Input
            id="forgot-phone"
            label="Номер телефона"
            type="tel"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Отправляем…' : 'Восстановить пароль'}
          </Button>
        </form>
      )}
    </Modal>
  );
}
