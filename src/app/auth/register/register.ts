import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Auth } from '../auth';

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  imports: [Auth, FormField],
  templateUrl: './register.html',
  styleUrls: ['./register.css', '../shared/auth-shared.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  registerModel = signal<RegisterData>({
    fullName: '',
    email: '',
    password: '',
  });

  // No validation rules because account creation is admin-controlled.
  registerForm = form(this.registerModel);

  onSubmit() {
    // TODO
  }
}
