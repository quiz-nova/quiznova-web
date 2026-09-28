import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UUIDService {
  generate(): string {
    return crypto.randomUUID();
  }
}
