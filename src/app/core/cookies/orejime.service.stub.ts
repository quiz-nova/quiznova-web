import { of } from 'rxjs';
import { vi } from 'vitest';

export class OrejimeServiceStub {
  initialize = vi.fn();

  showSettings = vi.fn();

  getSavedPreferences = vi.fn().mockReturnValue(of({}));
}
