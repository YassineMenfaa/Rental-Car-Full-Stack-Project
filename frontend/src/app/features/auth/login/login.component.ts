import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card glass-panel animate-enter">
        <div class="auth-header">
          <div class="logo-circle">NR</div>
          <h1>Welcome Back</h1>
          <p>Sign in to your premium account</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" class="auth-form">
          @if (error()) {
            <div class="error-message">
              {{ error() }}
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
                placeholder="Ex. 'admin'"
                required
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
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary full-width" [disabled]="loading()">
            {{ loading() ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>New to NeoRent? <a routerLink="/register">Create Account</a></p>
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
      padding: 0.875rem 1.25rem;
      font-size: 1rem;
      border-radius: var(--radius-lg);
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
export class LoginComponent {
  username = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    if (!this.username || !this.password) {
      this.error.set('Please fill in all fields');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error.set(err.message || 'Login failed');
          this.loading.set(false);
        }
      });
  }
}
