import type { Group } from './types';

export const mockGroups: Group[] = [
  {
    id: 'g-1',
    name: 'ПАО «СтройИнвест»',
    description: 'Сотрудники, прикреплённые к программе здоровьесбережения',
    patientIds: ['p-1', 'p-3'],
  },
  {
    id: 'g-2',
    name: 'ООО «Технопром»',
    description: 'Сотрудники, прикреплённые к программе здоровьесбережения',
    patientIds: ['p-2', 'p-4'],
  },
  {
    id: 'g-3',
    name: 'АО «Медгрупп»',
    description: 'Сотрудники, прикреплённые к программе здоровьесбережения',
    patientIds: ['p-5', 'p-6'],
  },
  {
    id: 'g-4',
    name: 'Группа наблюдения',
    description: 'Участники с активными сигналами внимания',
    patientIds: ['p-2', 'p-4', 'p-5', 'p-6'],
  },
];

export function findGroupById(id: string): Group | undefined {
  return mockGroups.find((g) => g.id === id);
}
