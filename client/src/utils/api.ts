import type { UserData } from '../interfaces/UserData';
import type { CardData } from '../interfaces/CardData';

class Api {
  private _baseUrl: string;
  private _headers: Record<string, string>;

  constructor(options: { baseUrl: string; headers: Record<string, string> }) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  async getUserInfo(): Promise<UserData> {
    try {
      const res = await fetch(`${this._baseUrl}/users/me`, {
        headers: this._headers,
      });
      if (res.ok) return await res.json();
      throw new Error(`Error: ${res.status}`);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getInitialCards(): Promise<CardData[]> {
    try {
      const res = await fetch(`${this._baseUrl}/cards`, {
        headers: this._headers,
      });
      if (res.ok) return await res.json();
      throw new Error(`Error: ${res.status}`);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async updateUserInfo(data: { name: string; about: string }): Promise<UserData> {
    try {
      const res = await fetch(`${this._baseUrl}/users/me`, {
        method: 'PATCH',
        headers: this._headers,
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
      throw new Error(`Error: ${res.status}`);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async updateAvatar(data: { avatar: string }): Promise<UserData> {
    try {
      const res = await fetch(`${this._baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: this._headers,
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
      throw new Error(`Error: ${res.status}`);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async addCard(data: { name: string; link: string }): Promise<CardData> {
    try {
      const res = await fetch(`${this._baseUrl}/cards`, {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
      throw new Error(`Error: ${res.status}`);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async deleteCard(cardId: string): Promise<void> {
    try {
      const res = await fetch(`${this._baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: this._headers,
      });
      if (res.ok) return;
      throw new Error(`Error: ${res.status}`);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async addLike(cardId: string): Promise<CardData> {
    try {
      const res = await fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: 'PUT',
        headers: this._headers,
      });
      if (res.ok) return await res.json();
      throw new Error(`Error: ${res.status}`);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async removeLike(cardId: string): Promise<CardData> {
    try {
      const res = await fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: 'DELETE',
        headers: this._headers,
      });
      if (res.ok) return await res.json();
      throw new Error(`Error: ${res.status}`);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

const api = new Api({
  baseUrl: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;