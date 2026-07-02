import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  type FormControl,
  type FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';

import { DEFAULT_USER_ROUTE, ROLES } from '@Core/config/role.config';
import { AuthService } from '@Features/auth/auth.service';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';

import { Button } from '@shared/components/button/button';
import { FieldError } from '@shared/components/field-error/field-error';
import { Logo } from '@shared/components/logo/logo';
import { UserRole } from '@shared/models/users/user-role.model';
import { User } from '@shared/models/users/user.model';

type LoginFormGroup = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
  role: FormControl<UserRole>;
}>;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Logo, FloatLabel, InputText, Password, FieldError, Button],
  template: `
    <section class="auth-page">
      <div class="auth-left-side">
        <div class="side-content">
          <app-logo />
          <h2>Welcome back</h2>
          <p>
            Access your dashboard, manage quizzes, and track student performance - all in one place.
          </p>
        </div>
      </div>

      <div class="auth-right-side">
        <app-logo class="auth-logo"></app-logo>
        <div class="auth-header">
          <h2>Sign in</h2>
          <p>Don't have an account? Contact Your Admin</p>
        </div>

        @if (loginFailed()) {
          <div class="login-failed" role="alert" aria-live="polite">
            <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
            <p>The login information you entered is incorrect.</p>
          </div>
        }

        <form class="auth-form" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="auth-field">
            <p-floatlabel variant="on">
              <input
                id="login-email"
                [fluid]="true"
                [attr.aria-invalid]="emailControl.invalid && emailControl.touched ? 'true' : null"
                [formControl]="emailControl"
                pInputText
                type="email"
                autocomplete="username"
                aria-describedby="email-is-required-error please-enter-a-valid-email-address-error"
              />
              <label for="login-email">Email</label>
            </p-floatlabel>

            @if (emailControl.invalid && emailControl.touched) {
              @if (emailControl.hasError('required')) {
                <app-field-error id="email-is-required-error">Email is required.</app-field-error>
              } @else if (emailControl.hasError('email')) {
                <app-field-error id="please-enter-a-valid-email-address-error"
                  >Please enter a valid email address.</app-field-error
                >
              }
            }
          </div>
          <div class="auth-field">
            <p-floatlabel variant="on">
              <p-password
                [feedback]="false"
                [toggleMask]="true"
                [fluid]="true"
                [attr.aria-invalid]="
                  passwordControl.invalid && passwordControl.touched ? 'true' : null
                "
                [formControl]="passwordControl"
                inputId="login-password"
                autocomplete="current-password"
                aria-describedby="password-is-required-error"
              />
              <label for="login-password">Password</label>
            </p-floatlabel>

            @if (passwordControl.invalid && passwordControl.touched) {
              @if (passwordControl.hasError('required')) {
                <app-field-error id="password-is-required-error"
                  >Password is required.</app-field-error
                >
              }
            }
          </div>
          <fieldset class="roles-group">
            <legend class="sr-only">Select your account role</legend>
            <div class="roles">
              @for (role of userRoles; track role.id) {
                <label class="role-box">
                  <input [value]="role.value" [formControl]="roleControl" type="radio" />
                  <span>{{ role.label }}</span>
                </label>
              }
            </div>
          </fieldset>
          <button
            class="auth-submit"
            [loading]="isLogging()"
            [disabled]="loginForm.invalid"
            appButton
            variant="green"
            type="submit"
          >
            <span>{{ isLogging() ? 'Signing in...' : 'Sign in' }}</span>
          </button>
        </form>
      </div>
    </section>
  `,
  styles: `
    .auth-page {
      display: flex;
      justify-content: space-between;
      min-height: 100dvh;
    }

    .auth-left-side {
      display: flex;
      justify-content: center;
      flex-direction: column;
      width: 50%;
      height: 100vh;
      background-color: var(--clr-blue-400);
      font-size: var(--fs-500);
      border-right: 1px solid rgba(255, 255, 255, 0.08);

      @media (width < 767px) {
        display: none;
      }

      .side-content {
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 1rem;
        padding-inline: 4rem;
        color: var(--clr-white);

        h2 {
          font-family: var(--ff-heading), sans-serif;
          font-size: var(--fs-800);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        p {
          color: var(--clr-gray-500);
          line-height: 1.6;
        }
      }
    }

    .auth-logo {
      font-size: var(--fs-600);
    }

    .auth-right-side {
      display: flex;
      justify-content: center;
      flex-direction: column;
      gap: 1.5rem;
      width: 50%;
      padding-inline: 4rem;
      background-color: var(--clr-white);

      @media (width < 767px) {
        width: 100%;
        padding-inline: 2rem;
      }
    }

    .auth-header {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      gap: 0.5rem;

      h2 {
        font-family: var(--ff-heading), sans-serif;
        font-size: var(--fs-800);
        color: var(--clr-blue-900);
        margin: 0;
      }

      p {
        color: var(--clr-gray-600);
        margin: 0;
      }

      a {
        color: var(--clr-green-400);

        &:hover {
          text-decoration: underline;
          text-decoration-color: var(--clr-green-400);
        }
      }
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .login-failed {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.9rem 1rem;
      border: 1px solid var(--clr-red-200);
      border-radius: var(--radius-md);
      background-color: var(--clr-red-50);

      i {
        flex-shrink: 0;
        color: var(--clr-red-800);
        font-size: 1.125rem;
      }

      p {
        margin: 0;
        color: var(--clr-red-800);
        font-weight: 600;
      }
    }

    .auth-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .roles {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      width: 100%;
    }

    .role-box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      border: 1px solid var(--clr-gray-300);
      border-radius: var(--radius-md);
      background-color: var(--clr-gray-50);
      color: var(--clr-blue-900);
      flex: 1;
      min-height: 56px;
      padding: 0.5rem;
      font-weight: 600;
      text-align: center;
      transition: all 0.25s var(--ease-standard);

      input {
        position: absolute;
        opacity: 0;
        visibility: hidden;
      }

      &:hover {
        border-color: var(--clr-green-400);
        background-color: var(--clr-green-50);
        color: var(--clr-green-800);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(18, 165, 136, 0.08);
        cursor: pointer;
      }

      &:has(input:checked) {
        border-color: var(--clr-green-400);
        background-color: var(--clr-green-50);
        color: var(--clr-green-800);
        font-weight: 700;
        box-shadow: 0 0 0 3px rgba(18, 165, 136, 0.15);
      }
    }

    .auth-submit {
      width: 100%;
      min-height: 3.5rem; /* Ensure enough height for the spinner */
      min-width: 10rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  protected readonly userRoles = ROLES;
  protected readonly isLogging = signal(false);
  protected readonly loginFailed = signal(false);

  protected readonly loginForm: LoginFormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    role: [UserRole.student, [Validators.required]],
  });

  protected get emailControl() {
    return this.loginForm.controls.email;
  }
  protected get passwordControl() {
    return this.loginForm.controls.password;
  }
  protected get roleControl() {
    return this.loginForm.controls.role;
  }
  onSubmit(): void {
    this.isLogging.set(true);
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (user: User) => {
        const route = DEFAULT_USER_ROUTE[user.role];
        this.router.navigate([route]);
      },
      error: () => {
        this.loginFailed.set(true);
        this.isLogging.set(false);
      },
    });
  }
}
