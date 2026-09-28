import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  get nativeWindow(): Window | null {
    if (typeof window !== 'undefined') {
      return window;
    }
    return null;
  }
}
