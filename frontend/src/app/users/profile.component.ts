import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  success = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    this.profileForm = this.fb.group({
      name: [user?.name || '', [Validators.required, Validators.minLength(2)]],
      email: [user?.email || '', [Validators.required, Validators.email]]
    });
  }

  updateProfile() {
    if (this.profileForm.invalid) return;
    this.loading = true;
    this.http.patch('http://localhost:3000/users/profile', this.profileForm.value, {
      headers: { Authorization: `Bearer ${this.auth.getToken()}` }
    }).subscribe({
      next: () => {
        this.success = 'Profile updated successfully!';
        this.error = '';
        this.loading = false;
        // Update user info in AuthService and UI
        const updatedUser = { ...this.auth.getUser(), ...this.profileForm.value };
        this.auth.setUser(updatedUser, this.auth.getToken() || '');
        // Redirect to home page
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update profile.';
        this.success = '';
        this.loading = false;
      }
    });
  }
}
