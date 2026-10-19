import type { UserData } from './UserData';

export interface LoginResponse {
  token: string;
  user: UserData;
}
