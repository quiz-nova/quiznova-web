export interface TokenResponse {
  accessToken: string;
  refreshToken: string | null;
  expiresOnUtc: string | null;
}
