import { Modal } from './Modal';
import { Button } from './Button';

export function StubModal({
  open,
  onClose,
  title,
  text,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  text: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-navy-950/80">{text}</p>
        <Button onClick={onClose}>Понятно</Button>
      </div>
    </Modal>
  );
}
