import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { delay } from '@/shared/lib/delay';
import { useSessionStore, type User } from '@/entities/user';

export function ProfileEditModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const currentUser = useSessionStore((s) => s.currentUser);
  const updateCurrentUser = useSessionStore((s) => s.updateCurrentUser);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<User>>(currentUser ?? {});

  if (!currentUser) return null;

  const set = <K extends keyof User>(key: K, value: User[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await delay(500);
    updateCurrentUser(form);
    setSaving(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Редактирование профиля">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            label="Фамилия"
            value={form.lastName ?? ''}
            onChange={(e) => set('lastName', e.target.value)}
            required
          />
          <Input
            label="Имя"
            value={form.firstName ?? ''}
            onChange={(e) => set('firstName', e.target.value)}
            required
          />
          <Input
            label="Отчество"
            value={form.patronymic ?? ''}
            onChange={(e) => set('patronymic', e.target.value)}
          />
        </div>
        <Input
          label="Телефон"
          type="tel"
          value={form.phone ?? ''}
          onChange={(e) => set('phone', e.target.value)}
        />
        <Input
          label="Электронная почта"
          type="email"
          value={form.email ?? ''}
          onChange={(e) => set('email', e.target.value)}
        />
        <Input
          label="Организация"
          value={form.organization ?? ''}
          onChange={(e) => set('organization', e.target.value)}
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Сохраняем…' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
