export interface UserDto {
  id: string;
  name: string;
  role: string;
}

export interface Auth {
  token: Token;
  user: UserDto;
}
export interface Token {
  accessToken: string;
  refreshToken: string;
  expiresOnUtc: string;
}
