
import { CommonModule } from '@angular/common';
import { Component,} from '@angular/core';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-logpage',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, RouterLink, CommonModule],
  templateUrl: './logpage.component.html',
  styleUrl: './logpage.component.css'
})

export class LogpageComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    // Initialize the form group
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(6)]]
    });
  }

  // OnSubmit method
  onSubmit() {
    if (this.loginForm.valid) {

      const {email, password} = this.loginForm.value;
      if( email === 'user1@gmail.com' && password === 'password123'){
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/todo'])
      }
     else {
  
      alert('Invalid Login Info');
          }
   }
}
}
