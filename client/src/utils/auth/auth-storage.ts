import type z from 'zod';
import { UserSchema } from '../api/user';

export type User = z.infer<typeof UserSchema>;

const key = 'hammerize.auth.user';

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user: User | null) {
  if (user) localStorage.setItem(key, JSON.stringify(user));
  else localStorage.removeItem(key);
}

export function getAccessToken(): string | null {
  const user = getStoredUser();
  return user?.accessToken ?? null;
}

export function setAccessToken(token: string) {
  const user = getStoredUser();
  if (!user) return;
  setStoredUser({ ...user, accessToken: token });
}

export function clearUser() {
  localStorage.removeItem(key);
}
