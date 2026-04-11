import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { DEFAULT_USER_ROUTE } from '../../../shared/models/user-role.model';
import { Logo } from '../../../shared/components/logo/logo';

type RegisterFormGroup = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}>;
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, Logo, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-left-side">
        <div class="side-content">
          <app-logo />
          <h2>Get started</h2>
          <p>Set up your institution in minutes. No credit card required for the free trial.</p>
        </div>
      </div>

      <div class="auth-right-side">
        <app-logo class="auth-logo"></app-logo>
        <div class="auth-header">
          <h2>Create account</h2>
          <p>
            Already have an account?
            <a [routerLink]="'/auth/login'">Sign in</a>
          </p>
        </div>

        <form (submit)="onSubmit()" class="auth-form" [formGroup]="registerForm">
          <div class="auth-field">
            <label for="register-full-name">Full name</label>
            <input id="register-full-name" type="text" formControlName="name" />
          </div>

          <div class="auth-field">
            <label for="register-email">Email</label>
            <input id="register-email" type="email" formControlName="email" />
          </div>

          <div class="auth-field">
            <label for="register-password">Password</label>
            <input id="register-password" type="password" formControlName="password" />
          </div>

          <button type="submit" class="btn btn-green auth-submit">Create account</button>
        </form>
      </div>
    </section>
  `,
  styleUrls: ['../shared/auth-page.shared.css'],
  styles: `
    .auth-submit {
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  protected readonly registerForm: RegisterFormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.getRawValue();
      this.authService.register({ name, email, password }).subscribe({
        next: (user) => {
          const route = DEFAULT_USER_ROUTE[user.userRole];
          this.router.navigate([route]);
        },
        error: (err) => {
          console.error('Registration failed', err);
        },
      });
    }
  }
}
