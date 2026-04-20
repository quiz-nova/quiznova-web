import { User } from '../../../shared/models/user/user.model';

export interface Auth {
  token: Token;
  user: User;
}
export interface Token {
  accessToken: string;
  refreshToken: string;
  expiresOnUtc: string;
}
