import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registrationpage',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './registrationpage.component.html',
  styleUrls: ['./registrationpage.component.css']
})
export class RegistrationpageComponent {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator }); 
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // Check if passwords match
    if (password !== confirmPassword) {
      return { mismatch: true };
    } else {
      return null;
    }
  }

  OnSubmit() {
    if (this.registrationForm.valid) {
      const { name, email, password } = this.registrationForm.value;
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Check if email is already registered
      const registeredUser = users.find((user: any) => user.email === email);
      if (registeredUser) {
        alert('Email is already registered. Please log in');
        return;
      }

      // Register new user
      users.push({ name, email, password });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registration successful! Please log in.');
      this.router.navigate(['/login']);
    }
  }
}
