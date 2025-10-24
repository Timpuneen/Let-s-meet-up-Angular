import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  isLoginMode = true;
  email = '';
  password = '';
  name = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  //click Submit
  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isLoginMode) {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: () => {
          this.successMessage = 'Login successful!';
          setTimeout(() => this.router.navigate(['/events']), 1000);
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Login failed';
        }
      });
    } else {
      this.authService.signup({ email: this.email, password: this.password, name: this.name }).subscribe({
        next: () => {
          this.successMessage = 'Registration successful!';
          setTimeout(() => this.router.navigate(['/events']), 1000);
        },
        error: (err) => {
          this.errorMessage = err.error?.email?.[0] || 'Registration failed';
        }
      });
    }
  }

  //login mode
  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
  }
}