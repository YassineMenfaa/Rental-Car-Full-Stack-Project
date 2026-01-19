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
          <div class="logo-circle">🚗</div>
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
            <label for="username">Username</label>
            <div class="input-wrapper">
              <input
                type="text"
                id="username"
                [(ngModel)]="username"
                name="username"
                placeholder="Choose a username"
                required
              />
              <span class="field-icon"></span>
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
              />
              <span class="field-icon"></span>
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
              />
              <span class="field-icon"></span>
            </div>
          </div>

          <button type="submit" class="btn btn-primary full-width" [disabled]="loading()">
            {{ loading() ? 'Creating account...' : 'Create Account' }} <span class="btn-arrow">→</span>
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
      background: white;
      border-radius: var(--radius-xl);
      padding: 3rem;
      width: 100%;
      max-width: 440px;
      border: 1px solid var(--border-light);
      box-shadow: var(--shadow-xl);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .logo-circle {
      width: 4rem;
      height: 4rem;
      background: var(--primary-50);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin-bottom: 1.5rem;
      box-shadow: var(--shadow-md);
    }

    .auth-header h1 {
      font-size: 1.75rem;
      margin: 0 0 0.5rem;
      font-weight: 800;
      color: var(--text-main);
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .auth-header p {
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
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
    }

    .input-wrapper {
      position: relative;
    }

    .form-group input {
      padding: 0.875rem 1rem 0.875rem 2.75rem;
      font-size: 1rem;
      border-radius: var(--radius-lg);
    }

    .field-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.1rem;
      opacity: 0.5;
      pointer-events: none;
    }

    .form-group input:focus + .field-icon {
      opacity: 1;
    }

    .btn.full-width {
      width: 100%;
      margin-top: 1rem;
      justify-content: space-between;
      height: 3.5rem;
    }

    .btn-arrow {
      font-size: 1.25rem;
      transition: transform 0.2s;
    }

    .btn:hover .btn-arrow {
      transform: translateX(4px);
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #fef2f2;
      border: 1px solid #fee2e2;
      color: #b91c1c;
      padding: 0.75rem;
      border-radius: var(--radius-lg);
      font-size: 0.9rem;
      font-weight: 500;
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f0fdf4;
      border: 1px solid #dcfce7;
      color: #15803d;
      padding: 0.75rem;
      border-radius: var(--radius-lg);
      font-size: 0.9rem;
      font-weight: 500;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      color: var(--text-muted);
      font-size: 0.95rem;
      border-top: 1px solid var(--border-light);
      padding-top: 1.5rem;
    }

    .auth-footer a {
      color: var(--primary-600);
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  username = '';
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

    if (!this.username || !this.password || !this.confirmPassword) {
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

    this.authService.register({ username: this.username, password: this.password })
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
