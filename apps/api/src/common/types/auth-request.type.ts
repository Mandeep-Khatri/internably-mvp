import { Request } from 'express';

export interface AuthPayload {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
}

export interface AuthenticatedRequest extends Request {
  user: AuthPayload;
}
