export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export interface RequestState {
  status: RequestStatus;
  errorMessage: string | null;
}

export const initialRequestState = (): RequestState => ({
  status: 'idle',
  errorMessage: null,
});
