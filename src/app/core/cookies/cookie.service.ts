/// <reference types="js-cookie" />

import { Injectable, signal, Signal } from '@angular/core';

export interface ICookieService {
  readonly cookies: Signal<Readonly<Record<string, any>>>;

  getAll(): any;

  get(name: string): any;

  set(name: string, value: any, options?: Cookies.CookieAttributes): void;

  remove(name: string, options?: Cookies.CookieAttributes): void;
}

@Injectable()
export abstract class CookieService implements ICookieService {
  protected readonly cookieSource = signal<Readonly<Record<string, any>>>({});

  public readonly cookies: Signal<Readonly<Record<string, any>>> = this.cookieSource.asReadonly();

  public abstract set(name: string, value: any, options?: Cookies.CookieAttributes): void;

  public abstract remove(name: string, options?: Cookies.CookieAttributes): void;

  public abstract get(name: string): any;

  public abstract getAll(): any;

  protected updateSource() {
    this.cookieSource.set(this.getAll());
  }
}
