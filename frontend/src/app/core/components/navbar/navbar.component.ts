import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar glass-header">
      <div class="container nav-content">
        <a routerLink="/" class="logo">
          NeoRent
        </a>

        <div class="nav-links">
          <a routerLink="/cars" routerLinkActive="active" class="nav-item">
            Explore
          </a>
          
          @if (authService.isAuthenticated()) {
            <a routerLink="/my-rentals" routerLinkActive="active" class="nav-item">
              My Rentals
            </a>
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
              Dashboard
            </a>
            
          }
        </div>

        <div class="nav-auth">
          @if (authService.isAuthenticated()) {
            <div class="user-profile">
              <span class="avatar">{{ authService.currentUser()?.username?.charAt(0)?.toUpperCase() }}</span>
              <button (click)="authService.logout()" class="btn-logout">
                Logout
              </button>
            </div>
          } @else {
            <a routerLink="/login" class="btn btn-secondary btn-sm">Sign In</a>
            <a routerLink="/register" class="btn btn-primary btn-sm">Get Started</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      width: 100%;
      z-index: 1000;
      transition: all 0.3s ease;
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 4.5rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-weight: 900;
      font-size: 1.5rem;
      color: #0f172a;
      letter-spacing: -0.05em;
      transition: all 0.3s;
    }

    .logo:hover {
      color: #2dd4bf;
      text-shadow: 0 0 15px rgba(45, 212, 191, 0.4);
    }

    .logo-icon {
      font-size: 1.5rem;
      -webkit-text-fill-color: initial;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    }

    .nav-links {
      display: flex;
      gap: 0.5rem;
      background: rgba(15, 23, 42, 0.03);
      backdrop-filter: blur(10px);
      padding: 0.25rem;
      border-radius: var(--radius-full);
      border: 1px solid rgba(15, 23, 42, 0.08);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #94a3b8;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.85rem;
      padding: 0.5rem 1.25rem;
      border-radius: var(--radius-full);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      letter-spacing: 0.02em;
    }

    .nav-item:hover {
      color: #0f172a;
      background: rgba(15, 23, 42, 0.05);
      transform: translateY(-1px);
    }

    .nav-item.active {
      background: rgba(255, 255, 255, 0.1);
      color: #2dd4bf;
      box-shadow: 0 4px 12px rgba(45, 212, 191, 0.15);
      font-weight: 700;
    }


    .nav-auth {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      border-radius: var(--radius-full);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(15, 23, 42, 0.1);
      backdrop-filter: blur(10px);
      padding: 0.25rem 0.25rem 0.25rem 1.25rem;
      border-radius: var(--radius-full);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .avatar {
      width: 2.25rem;
      height: 2.25rem;
      background: linear-gradient(135deg, #2dd4bf 0%, #008080 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.9rem;
      box-shadow: 0 4px 12px rgba(45, 212, 191, 0.3);
    }

    .btn-logout {
      height: 2.25rem;
      padding: 0 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: rgba(255, 255, 255, 0.05);
      color: #94a3b8;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .btn-logout:hover {
      background: #ef4444;
      color: white;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
}
