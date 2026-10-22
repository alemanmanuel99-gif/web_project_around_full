import type { UserData } from '../interfaces/UserData';
import type { LoginResponse } from '../interfaces/AuthData';

const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001').replace(/\/+$/, '');

async function checkResponse<T>(res: Response): Promise<T> {
  if (res.ok) return res.json();
  return Promise.reject(new Error(`Error: ${res.status}`));
}

export async function registerUser(email: string, password: string): Promise<UserData> {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return checkResponse<UserData>(res);
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return checkResponse<LoginResponse>(res);
}
