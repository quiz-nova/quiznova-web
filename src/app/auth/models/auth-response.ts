import { TokenResponse } from './token-response';

export interface AuthUserResponse {
  userId: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: TokenResponse | null;
  user: AuthUserResponse | null;
}
