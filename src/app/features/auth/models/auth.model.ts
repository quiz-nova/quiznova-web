import {User} from '../../../shared/models/user.model';

export interface Auth {
  token: Token;
  user: User;
}
export interface Token {
  accessToken: string;
  refreshToken: string;
  expiresOnUtc: string;
}
