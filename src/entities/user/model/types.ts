export type UserRole = 'patient' | 'specialist';

export interface Vitals {
  heightCm: number;
  weightKg: number;
  age: number;
}

export interface User {
  id: string;
  role: UserRole;
  lastName: string;
  firstName: string;
  patronymic: string;
  phone: string;
  email: string;
  organization: string;
  vitals: Vitals;
}

export function fullName(user: Pick<User, 'lastName' | 'firstName' | 'patronymic'>) {
  return `${user.lastName} ${user.firstName} ${user.patronymic}`.trim();
}

export function shortName(user: Pick<User, 'lastName' | 'firstName' | 'patronymic'>) {
  return `${user.lastName} ${user.firstName[0]}.${user.patronymic[0]}.`;
}
