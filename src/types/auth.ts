// Общие типы для всего приложения

export interface User {
  id: number;
  email: string;
  username: string;
  name?: string;
  avatar?: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
}
