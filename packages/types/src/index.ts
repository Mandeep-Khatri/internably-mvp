export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'DENIED';
export type GroupType = 'SCHOOL' | 'CITY' | 'HBCU' | 'COMPANY' | 'INTEREST';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
}
