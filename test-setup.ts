import '@angular/compiler';
import { ɵresolveComponentResources as resolveComponentResources } from '@angular/core';
import '@testing-library/jest-dom/vitest';

await resolveComponentResources(() => Promise.resolve(''));
