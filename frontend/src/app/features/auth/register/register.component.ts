import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card glass-panel animate-enter">
        <div class="auth-header">
          <div class="logo-circle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </div>
          <h1>Create Account</h1>
          <p>Start your car rental journey</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          @if (error()) {
            <div class="error-message">
              <span class="error-icon">⚠️</span> {{ error() }}
            </div>
          }

          @if (success()) {
            <div class="success-message">
              <span class="success-icon">✅</span> {{ success() }}
            </div>
          }

          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-wrapper">
              <input
                type="email"
                id="email"
                [(ngModel)]="email"
                name="email"
                placeholder="Enter your email"
                required
                autocomplete="email"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <input
                type="password"
                id="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Create a password"
                required
                autocomplete="new-password"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="input-wrapper">
              <input
                type="password"
                id="confirmPassword"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                required
                autocomplete="new-password"
              />
            </div>
          </div>

          <button type="submit" class="btn btn-primary full-width" [disabled]="loading()">
            {{ loading() ? 'Creating account...' : 'Create Account' }} <span class="btn-arrow" *ngIf="!loading()">→</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-body);
      background-image:
        radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 20%);
      padding: 2rem;
    }

    .auth-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 24px;
      padding: 3rem;
      width: 100%;
      max-width: 480px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05);
    }

    .logo-circle {
      width: 4rem;
      height: 4rem;
      background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
    }

    .logo-circle svg {
      width: 2.25rem;
      height: 2.25rem;
      color: white;
    }

    .auth-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2.5rem;
    }

    .auth-header h1 {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-main);
      margin: 0 0 0.5rem;
      letter-spacing: -0.025em;
    }

    .auth-header p {
      color: var(--text-muted);
      font-size: 1rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      color: var(--text-main);
      font-size: 0.9rem;
      font-weight: 600;
      margin-left: 0.25rem;
    }

    .input-wrapper {
      position: relative;
    }

    .form-group input {
      width: 100%;
      padding: 1rem 1.25rem;
      font-size: 1rem;
      border-radius: 12px;
      border: 2px solid transparent;
      background: white;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 4px var(--primary-100);
    }

    .btn.full-width {
      width: 100%;
      margin-top: 1rem;
      justify-content: center;
      height: 3.5rem;
      font-size: 1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
      border: none;
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
      transition: all 0.2s;
    }

    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
    }

    .btn:active {
      transform: translateY(0);
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #fee2e2;
      border: 1px solid #fecaca;
      color: #991b1b;
      padding: 0.875rem;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #f0fdf4;
      border: 1px solid #dcfce7;
      color: #15803d;
      padding: 0.875rem;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2.5rem;
      color: var(--text-muted);
      font-size: 0.95rem;
      border-top: 1px solid rgba(0,0,0,0.05);
      padding-top: 1.5rem;
    }

    .auth-footer a {
      color: var(--primary-600);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }

    .auth-footer a:hover {
      color: var(--primary-700);
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    this.error.set(null);
    this.success.set(null);

    if (!this.email || !this.password || !this.confirmPassword) {
      this.error.set('Please fill in all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    if (this.password.length < 6) {
      this.error.set('Password must be at least 6 characters');
      return;
    }

    this.loading.set(true);

    this.authService.register({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.success.set('Account created successfully! Redirecting to login...');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.error.set(err.message || 'Registration failed');
          this.loading.set(false);
        }
      });
  }
}
