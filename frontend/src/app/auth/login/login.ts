import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        if (res.error) {
          this.error = res.message || 'Login failed';
          if (res.feildErrors?.length) {
            this.error += ': ' + res.feildErrors.join(', ');
          }
          return;
        }
        if (res.data?.user && res.data?.access_token) {
          this.auth.setUser(res.data.user, res.data.access_token);
          this.router.navigate(['/products']);
        } else {
          this.error = 'Invalid login response';
        }
      },
      error: (err) => {
        if (err.error?.feildErrors?.length) {
          this.error = err.error.feildErrors.join(', ');
        } else {
          this.error = 'Invalid credentials';
        }
        console.error('Login failed:', err);
      }
    });
  }
}
