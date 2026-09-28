import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export abstract class OrejimeService {
  abstract initialize(): any;

  abstract showSettings(): any;

  abstract getSavedPreferences(): Observable<any>;
}
