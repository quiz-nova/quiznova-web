import { TokenResponseModel } from './token-response.model';
import { UserResponseModel } from './user-response.model';

export interface AuthResponseModel {
  message: string;
  token: TokenResponseModel | null;
  user: UserResponseModel | null;
}