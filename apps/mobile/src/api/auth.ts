import { api } from './client';

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function register(email: string, password: string) {
  const { data } = await api.post('/auth/register', { email, password });
  return data;
}

export async function googleLogin(idToken: string) {
  const { data } = await api.post('/auth/google', { idToken });
  return data;
}

export async function resendVerification(email: string) {
  const { data } = await api.post('/auth/resend-verification', { email });
  return data as { message?: string; verificationLink?: string };
}

export async function me() {
  const { data } = await api.get('/auth/me');
  return data;
}
