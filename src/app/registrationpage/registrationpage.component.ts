import { CommonModule } from '@angular/common';
import { Component, Inject,PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-registrationpage',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './registrationpage.component.html',
  styleUrls: ['./registrationpage.component.css']
})
export class RegistrationpageComponent {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder,
     private router: Router,
     private userService: UserService ,
    @Inject(PLATFORM_ID) private platformId: Object) {
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
    if (this.registrationForm.valid && isPlatformBrowser(this.platformId)) {
      const { name, email, password } = this.registrationForm.value;
      // Check if email is already registered
      this.userService.isEmailRegistered(email).subscribe(isRegistered => {
        if (isRegistered) {
          alert('Email is already registered. Please log in');
          return;
      } else {
         // Register new user
         this.userService.registerUser({ name, email, password }).subscribe(() => {
          alert('Registration successful! Please log in.');
          this.router.navigate(['/login']);
      });
      }
      });

    }
  }
}