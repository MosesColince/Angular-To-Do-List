
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component,Inject, PLATFORM_ID} from '@angular/core';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-logpage',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, RouterLink, CommonModule],
  templateUrl: './logpage.component.html',
  styleUrl: './logpage.component.css'
})

export class LogpageComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
     private router: Router,
     private userService: UserService,
      @Inject(PLATFORM_ID) private platformId: Object) {
    // Initialize the form group
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(6)]]
    });
  }

  // OnSubmit method
  onSubmit() {
    if (this.loginForm.valid && isPlatformBrowser(this.platformId)) {
      const {email, password} = this.loginForm.value;
     this.userService.loginUser(email,password).subscribe(user => {
      if(user){
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/todo']);
      }
     else {
      alert('Invalid Login Info');
          }
     });
    } else { alert('Please fill in all required fields correctly');
      }
}
}
