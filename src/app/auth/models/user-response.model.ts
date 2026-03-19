import { ClaimResponseModel } from './claim-response.model';

export interface UserResponseModel {
  userId: string;
  name: string;
  role: string;
  claims: ClaimResponseModel[];
}