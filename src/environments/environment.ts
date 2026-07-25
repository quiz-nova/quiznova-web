export interface Environment {
  appName: string;
  isProduction: boolean;
  apiUrl: string;
  enableDevTools: boolean;
  defaultPageSize: number;
  debounceTimeMs: number;
  quizTimerIntervalMs: number;
  storage: {
    accessTokenKey: string;
    currentUserKey: string;
  };
}

export const environment: Environment = {
  appName: 'QuizNova',
  isProduction: false,
  apiUrl: '',
  enableDevTools: false,
  defaultPageSize: 10,
  debounceTimeMs: 300,
  quizTimerIntervalMs: 1000,
  storage: {
    accessTokenKey: 'access_token',
    currentUserKey: 'current_user',
  },
};
