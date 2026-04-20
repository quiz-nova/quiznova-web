import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  type FormControl,
  type FormGroup,
} from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { DEFAULT_USER_ROUTE, ROLES, UserRole } from '../../../shared/models/user/user-role.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Logo } from '../../../shared/components/logo/logo';
import { User } from '../../../shared/models/user/user.model';

type LoginFormGroup = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
  role: FormControl<UserRole>;
}>;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Logo, FloatLabel, InputText, Password],
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

        @if (loginFaild()) {
          <div class="login-faild" role="alert" aria-live="polite">
            <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
            <p>The login information you entered is incorrect.</p>
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="auth-field">
            <p-floatlabel variant="on">
              <input
                pInputText
                id="login-email"
                type="email"
                formControlName="email"
                [fluid]="true"
                autocomplete="username"
              />
              <label for="login-email">Email</label>
            </p-floatlabel>

            <div class="auth-error">
              @if (emailControl.invalid && emailControl.touched) {
                @if (emailControl.hasError('required')) {
                  <span>Email is required.</span>
                } @else if (emailControl.hasError('email')) {
                  <span>Please enter a valid email address.</span>
                }
              }
            </div>
          </div>
          <div class="auth-field">
            <p-floatlabel variant="on">
              <p-password
                inputId="login-password"
                formControlName="password"
                [feedback]="false"
                [toggleMask]="true"
                [fluid]="true"
                autocomplete="current-password"
              />
              <label for="login-password">Password</label>
            </p-floatlabel>

            <div class="auth-error">
              @if (passwordControl.invalid && passwordControl.touched) {
                @if (passwordControl.hasError('required')) {
                  <span>Password is required.</span>
                }
              }
            </div>
          </div>
          <div class="roles">
            @for (role of userRoles; track role.id) {
              <label class="btn btn-gray role-box">
                <input type="radio" formControlName="role" [value]="role.value" />
                <span>{{ role.label }}</span>
              </label>
            }
          </div>
          <button type="submit" class="btn btn-green auth-submit">Sign in</button>
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

      @media (width < 767px) {
        display: none;
      }

      .side-content {
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 0.5rem;
        padding-inline: 2rem;
        color: var(--clr-white);

        p {
          color: var(--clr-gray-500);
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
      gap: 1rem;
      width: 50%;
      padding-inline: 2rem;

      @media (width < 767px) {
        width: 100%;
      }
    }

    .auth-header {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      gap: 0.5rem;

      h2 {
        font-size: var(--fs-700);
      }

      p {
        color: var(--clr-gray-600);
      }

      a {
        color: var(--clr-green-500);

        &:hover {
          text-decoration: underline;
          text-decoration-color: var(--clr-green-500);
        }
      }
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .login-faild {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.9rem 1rem;
      border: 1px solid var(--clr-gray-500);
      border-radius: var(--radius-lg);
      background-color: var(--clr-gray-100);

      i {
        flex-shrink: 0;
        color: var(--clr-red-500);
        font-size: 1.125rem;
      }

      p {
        margin: 0;
        color: var(--clr-gray-500);
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
      flex: 1;
      min-height: 60px;
      padding: 0.5rem;
      color: var(--clr-gray-600);
      text-align: center;
      transition:
        background-color 0.25s ease,
        color 0.25s ease,
        border-color 0.25s ease;
      border-color: var(--clr-gray-600);

      input {
        position: absolute;
        opacity: 0;
        visibility: hidden;
      }

      &:hover {
        background-color: var(--clr-violet-500);
        color: var(--clr-white);
        border-color: var(--clr-transparent);
        cursor: pointer;
      }

      &:has(input:checked) {
        background-color: var(--clr-violet-500);
        color: var(--clr-white);
        border-color: var(--clr-transparent);
      }
    }
    .auth-submit {
      width: 100%;
    }
    .auth-error {
      color: var(--clr-red-500);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  protected readonly userRoles = ROLES;

  protected readonly loginFaild = signal(false);

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
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (user: User) => {
        const route = DEFAULT_USER_ROUTE[user.role];
        this.router.navigate([route]);
      },
      error: () => {
        this.loginFaild.set(true);
      },
    });
  }
}
