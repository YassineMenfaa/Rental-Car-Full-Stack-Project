import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services';
import { useMyActiveRentalsQuery, useAvailableCarsQuery } from '../../core/queries';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-wrapper">
      <div class="background-elements">
        <div class="glow-sphere sphere-1"></div>
        <div class="glow-sphere sphere-2"></div>
      </div>

      <div class="dashboard-container container">
        <div class="split-layout">
          
          <!-- Main Area (Left) -->
          <main class="main-column">
            <!-- Hero Simplified -->
            <section class="hero-module animate-in">
              <span class="eyebrow">NEORENT CONTROL CENTER</span>
              <h1>Welcome, <span class="highlight">{{ getDisplayName() }}</span></h1>
              <p class="hero-subtitle">System status operational. Select a module to begin.</p>
              <button (click)="authService.logout()" class="btn-logout-minimal">Exit System</button>
            </section>

            <!-- Active Rentals Center Stage -->
            <section class="module rentals-module animate-in" style="animation-delay: 0.1s">
              <div class="module-header">
                <h3>Active Fleet Journeys</h3>
                <a routerLink="/my-rentals" class="text-link">Full History</a>
              </div>
              
              @if (activeRentalsQuery.data()?.length) {
                <div class="rental-list">
                  @for (rental of activeRentalsQuery.data(); track rental.id) {
                    <div class="rental-card">
                      <div class="info">
                        <span class="brand">{{ rental.car?.brand }}</span>
                        <span class="model">{{ rental.car?.model }}</span>
                        <span class="dates">{{ rental.startDate }} to {{ rental.endDate }}</span>
                      </div>
                      <div class="price">{{ rental.totalPrice | currency }}</div>
                    </div>
                  }
                </div>
              } @else {
                <div class="empty-module">
                  <p>No active rental sessions found.</p>
                  <a routerLink="/cars" class="btn-action">Explore Collection</a>
                </div>
              }
            </section>
          </main>

          <!-- Sidebar (Right) -->
          <aside class="sidebar-column">
            <!-- Metrics Module -->
            <section class="module metrics-module animate-in" style="animation-delay: 0.2s">
              <div class="metric-item">
                <span class="m-label">AVAILABLE UNITS</span>
                <span class="m-value">{{ availableCarsQuery.data()?.length || 0 }}</span>
              </div>
              <div class="metric-divider"></div>
              <div class="metric-item">
                <span class="m-label">ACTIVE CONTRACTS</span>
                <span class="m-value">{{ activeRentalsQuery.data()?.length || 0 }}</span>
              </div>
              <div class="metric-divider"></div>
              <div class="metric-item">
                <span class="m-label">ACCOUNT RANK</span>
                <span class="m-value-text">{{ authService.currentUser()?.role }}</span>
              </div>
            </section>

            <!-- Actions Module -->
            <section class="module actions-module animate-in" style="animation-delay: 0.3s">
              <h3>System Navigation</h3>
              <div class="action-stack">
                <a routerLink="/cars" class="stack-item">Explore Cars</a>
                <a routerLink="/my-rentals" class="stack-item">Rental History</a>
                
                @if (authService.isAdmin()) {
                  <div class="admin-group">
                    <span class="group-label">Administrative</span>
                    <a routerLink="/admin/cars" class="stack-item admin-link">Manage Cars</a>
                    <a routerLink="/admin/rentals" class="stack-item admin-link">Global Logs</a>
                  </div>
                }
              </div>
            </section>
          </aside>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      min-height: 100vh;
      background: #f8fafc;
      color: #0f172a;
      padding: 3rem 0;
      font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
    }

    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    /* Split Layout */
    .split-layout {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
      align-items: start;
    }

    /* Modules */
    .module {
      background: white;
      border: 1px solid rgba(15, 23, 42, 0.06);
      border-radius: 2rem;
      padding: 2.5rem;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
      margin-bottom: 2rem;
    }

    .module-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h3 {
      font-size: 1.1rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.01em;
      color: #0f172a;
    }

    /* Hero Section */
    .hero-module {
      padding: 2rem 0 4rem;
    }

    .eyebrow {
      font-size: 0.7rem;
      font-weight: 900;
      letter-spacing: 0.25em;
      color: #0d9488;
      display: block;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 3.5rem;
      font-weight: 300;
      margin: 0 0 1rem;
      letter-spacing: -0.04em;
    }

    h1 .highlight {
      font-weight: 800;
      color: #0f172a;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: #64748b;
      margin-bottom: 2.5rem;
    }

    /* Rentals List */
    .rental-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .rental-card {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid rgba(15, 23, 42, 0.03);
    }

    .rental-card .info {
      display: flex;
      flex-direction: column;
    }

    .brand { font-weight: 800; font-size: 1.1rem; }
    .model { color: #64748b; font-size: 0.9rem; margin-bottom: 0.25rem; }
    .dates { font-size: 0.75rem; color: #94a3b8; font-weight: 600; }

    .price {
      font-weight: 900;
      color: #0d9488;
      font-size: 1.1rem;
    }

    /* Sidebar Metrics */
    .metric-item {
      padding: 1rem 0;
    }

    .m-label {
      font-size: 0.65rem;
      font-weight: 900;
      color: #94a3b8;
      letter-spacing: 0.15em;
      display: block;
      margin-bottom: 0.5rem;
    }

    .m-value {
      font-size: 2.5rem;
      font-weight: 900;
      color: #0f172a;
    }

    .m-value-text {
      font-size: 1.25rem;
      font-weight: 800;
      color: #d97706;
      text-transform: uppercase;
    }

    .metric-divider {
      height: 1px;
      background: rgba(15, 23, 42, 0.05);
      margin: 0.5rem 0;
    }

    /* Action Stack */
    .action-stack {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .stack-item {
      background: #f8fafc;
      padding: 1rem 1.5rem;
      border-radius: 1rem;
      text-decoration: none;
      color: #0f172a;
      font-weight: 700;
      font-size: 0.9rem;
      border: 1px solid transparent;
      transition: all 0.2s;
    }

    .stack-item:hover {
      background: white;
      border-color: #0f172a;
      transform: translateX(4px);
    }

    .admin-group {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(15, 23, 42, 0.05);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .group-label {
      font-size: 0.65rem;
      font-weight: 900;
      color: #94a3b8;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    .admin-link {
      background: #fff7ed;
      color: #9a3412;
    }

    .admin-link:hover {
      background: #ffedd5;
      border-color: #9a3412;
    }

    /* Buttons & Links */
    .btn-logout-minimal {
      background: transparent;
      border: 1px solid #e2e8f0;
      color: #64748b;
      padding: 0.6rem 1.2rem;
      border-radius: 0.75rem;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-logout-minimal:hover {
      background: #fef2f2;
      color: #ef4444;
      border-color: #fecaca;
    }

    .text-link {
      font-size: 0.85rem;
      color: #4f46e5;
      font-weight: 700;
      text-decoration: none;
    }

    .btn-action {
      display: inline-block;
      background: #0f172a;
      color: white;
      padding: 0.9rem 2rem;
      border-radius: 1rem;
      font-weight: 700;
      text-decoration: none;
      margin-top: 1.5rem;
    }

    .empty-module {
      text-align: center;
      padding: 3rem 0;
      color: #64748b;
    }

    /* Animations */
    .animate-in {
      animation: fadeInUp 0.5s ease-out both;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .split-layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  authService = inject(AuthService);
  activeRentalsQuery = useMyActiveRentalsQuery();
  availableCarsQuery = useAvailableCarsQuery();
  private http = inject(HttpClient);

  getDisplayName(): string {
    const email = this.authService.currentUser()?.email;
    if (!email) return 'User';
    return email.split('@')[0];
  }

  testAuth() {
    this.http.get('http://localhost:8082/api/cars/auth-debug', { responseType: 'text' })
      .subscribe({
        next: (res: string) => alert('Backend sees your role as: ' + res),
        error: (err: any) => alert('Auth Test Failed: ' + err.status + ' ' + (err.error || err.message))
      });
  }
}
