import { TokenResponseModel } from './token-response.model';
import { UserResponseModel } from './user-response.model';

export interface AuthResponseModel {
  token: TokenResponseModel;
  user: UserResponseModel;
}
