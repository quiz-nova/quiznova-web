import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type FormControl,
  type FormGroup,
} from '@angular/forms';
import { DEFAULT_USER_ROUTE, ROLES, UserRole } from '../../../shared/models/user-role.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Logo } from '../../../shared/components/logo/logo';

interface LoginData {
  email: string;
  password: string;
  role: UserRole;
}
type LoginFormGroup = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
  role: FormControl<UserRole>;
}>;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Logo],
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

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="auth-field">
            <label for="login-email">Email</label>
            <input id="login-email" type="email" formControlName="email" />
          </div>
          <div class="auth-field">
            <label for="login-password">Password</label>
            <input id="login-password" type="password" formControlName="password" />
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
  styleUrls: ['../shared/auth-page.shared.css'],
  styles: `
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  protected readonly userRoles = ROLES;
  protected readonly loginForm: LoginFormGroup;

  constructor() {
    this.loginForm = this.formBuilder.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: [UserRole.student, [Validators.required]],
    });
  }

  onSubmit(): void {
    const loginData: LoginData = this.loginForm.getRawValue();
    this.authService.login(loginData).subscribe({
      next: (user) => {
        const route = DEFAULT_USER_ROUTE[user.userRole];
        this.router.navigate([route]);
      },
      error: (err) => {
        console.error('Login failed', err);
      },
    });
  }
}
