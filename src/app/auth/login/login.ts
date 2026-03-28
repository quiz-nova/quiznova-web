import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type FormControl,
  type FormGroup,
} from '@angular/forms';
import { ROLES, UserRole } from '../../shared/models/user-role.model';
import { AuthService } from '../auth.service';
import { Auth } from '../auth';

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
  imports: [Auth, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css', '../shared/auth-shared.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  readonly userRoles = ROLES;
  readonly loginForm: LoginFormGroup;
  readonly errorMessage = signal('');

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  constructor() {
    this.loginForm = this.formBuilder.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: [UserRole.student, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData: LoginData = this.loginForm.getRawValue();
    this.authService.login(loginData).subscribe({
      next: () => {
        this.errorMessage.set('');
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.errorMessage.set('Invalid Data');
          return;
        }

        if (error.status === 500) {
          this.errorMessage.set('Server have some problems, try again later');
          return;
        }

        this.errorMessage.set('Unable to login right now. Please try again.');
      },
    });
  }
}
