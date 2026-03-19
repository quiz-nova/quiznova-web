export interface TokenResponseModel {
  accessToken: string;
  refreshToken: string | null;
  expiresOnUtc: string | null;
}