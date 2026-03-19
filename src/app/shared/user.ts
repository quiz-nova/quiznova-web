export class User {
  constructor(
    public userId = '',
    public name = '',
    public role = '',
    public claims: string[] = [],
    public accessToken = '',
  ) {}
}
