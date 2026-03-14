import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { Logo } from '../logo/logo';

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  imports: [Logo, RouterLink, FormField],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerModel = signal<RegisterData>({
    fullName: '',
    email: '',
    password: '',
  });

  // No validation rules because account creation is admin-controlled.
  registerForm = form(this.registerModel);

  onSubmit() {}
}
