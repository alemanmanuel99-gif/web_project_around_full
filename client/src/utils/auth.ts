import type { RegisterResponse, LoginResponse, CheckTokenResponse } from '../interfaces/AuthData';

const BASE_URL = 'https://se-register-api.en.tripleten-services.com/v1';

async function checkResponse<T>(res: Response): Promise<T> {
  if (res.ok) return res.json();
  return Promise.reject(new Error(`Error: ${res.status}`));
}

export async function registerUser(email: string, password: string): Promise<RegisterResponse> {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await checkResponse<RegisterResponse>(res);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    const res = await fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await checkResponse<LoginResponse>(res);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function checkToken(token: string): Promise<CheckTokenResponse> {
  try {
    const res = await fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await checkResponse<CheckTokenResponse>(res);
  } catch (err) {
    return Promise.reject(err);
  }
}
