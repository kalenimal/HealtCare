import type { User } from './types';

export const mockPatients: User[] = [
  {
    id: 'p-1',
    role: 'patient',
    lastName: 'Иванова',
    firstName: 'Мария',
    patronymic: 'Сергеевна',
    phone: '+7 (901) 234-56-78',
    email: 'ivanova.ms@example.com',
    organization: 'ПАО «СтройИнвест»',
    vitals: { heightCm: 168, weightKg: 61, age: 34 },
  },
  {
    id: 'p-2',
    role: 'patient',
    lastName: 'Петров',
    firstName: 'Алексей',
    patronymic: 'Викторович',
    phone: '+7 (902) 345-67-89',
    email: 'petrov.av@example.com',
    organization: 'ООО «Технопром»',
    vitals: { heightCm: 181, weightKg: 89, age: 47 },
  },
  {
    id: 'p-3',
    role: 'patient',
    lastName: 'Смирнова',
    firstName: 'Ольга',
    patronymic: 'Дмитриевна',
    phone: '+7 (903) 456-78-90',
    email: 'smirnova.od@example.com',
    organization: 'ПАО «СтройИнвест»',
    vitals: { heightCm: 172, weightKg: 66, age: 29 },
  },
  {
    id: 'p-4',
    role: 'patient',
    lastName: 'Кузнецов',
    firstName: 'Дмитрий',
    patronymic: 'Игоревич',
    phone: '+7 (904) 567-89-01',
    email: 'kuznetsov.di@example.com',
    organization: 'ООО «Технопром»',
    vitals: { heightCm: 176, weightKg: 95, age: 52 },
  },
  {
    id: 'p-5',
    role: 'patient',
    lastName: 'Соколова',
    firstName: 'Екатерина',
    patronymic: 'Андреевна',
    phone: '+7 (905) 678-90-12',
    email: 'sokolova.ea@example.com',
    organization: 'АО «Медгрупп»',
    vitals: { heightCm: 164, weightKg: 58, age: 41 },
  },
  {
    id: 'p-6',
    role: 'patient',
    lastName: 'Волков',
    firstName: 'Николай',
    patronymic: 'Павлович',
    phone: '+7 (906) 789-01-23',
    email: 'volkov.np@example.com',
    organization: 'АО «Медгрупп»',
    vitals: { heightCm: 179, weightKg: 84, age: 38 },
  },
];

export const mockSpecialist: User = {
  id: 's-1',
  role: 'specialist',
  lastName: 'Фёдорова',
  firstName: 'Анна',
  patronymic: 'Игоревна',
  phone: '+7 (999) 111-22-33',
  email: 'fedorova.ai@sechenov.ru',
  organization: 'Сеченовский Университет',
  vitals: { heightCm: 170, weightKg: 60, age: 45 },
};

export const mockUsers: User[] = [...mockPatients, mockSpecialist];

export function findUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}
