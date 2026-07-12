import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { delay } from '@/shared/lib/delay';
import { useSessionStore } from '@/entities/user';

export function VitalsEditModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const currentUser = useSessionStore((s) => s.currentUser);
  const updateCurrentUser = useSessionStore((s) => s.updateCurrentUser);
  const [saving, setSaving] = useState(false);
  const [height, setHeight] = useState(currentUser?.vitals.heightCm ?? 170);
  const [weight, setWeight] = useState(currentUser?.vitals.weightKg ?? 70);
  const [age, setAge] = useState(currentUser?.vitals.age ?? 30);

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await delay(500);
    updateCurrentUser({ vitals: { heightCm: height, weightKg: weight, age } });
    setSaving(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Уточняющие данные">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="Рост, см"
          type="number"
          min={100}
          max={230}
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
        />
        <Input
          label="Вес, кг"
          type="number"
          min={30}
          max={250}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
        />
        <Input
          label="Возраст"
          type="number"
          min={1}
          max={120}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
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
