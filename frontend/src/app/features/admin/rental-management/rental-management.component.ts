import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { useAllRentalsQuery } from '../../../core/queries';

@Component({
    selector: 'app-rental-management',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="admin-container">
      <header class="header">
        <a routerLink="/dashboard" class="back-btn">← Dashboard</a>
        <h1>All Rentals</h1>
      </header>

      <main class="content">
        @if (rentalsQuery.isPending()) {
          <div class="loading">Loading rentals...</div>
        }

        @if (rentalsQuery.data(); as rentals) {
          <div class="stats-row">
            <div class="stat">
              <span class="stat-value">{{ rentals.length }}</span>
              <span class="stat-label">Total Rentals</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ getActiveCount(rentals) }}</span>
              <span class="stat-label">Active</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ getTotalRevenue(rentals) | currency }}</span>
              <span class="stat-label">Total Revenue</span>
            </div>
          </div>

          <div class="rentals-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Car</th>
                  <th>Period</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (rental of rentals; track rental.id) {
                  <tr>
                    <td>#{{ rental.id }}</td>
                    <td>{{ rental.username }}</td>
                    <td>{{ rental.car?.brand }} {{ rental.car?.model }}</td>
                    <td>{{ rental.startDate }} - {{ rental.endDate }}</td>
                    <td>{{ rental.totalPrice | currency }}</td>
                    <td>
                      <span class="status" [class]="rental.status.toLowerCase()">
                        {{ rental.status }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </main>
    </div>
  `,
    styles: [`
    .admin-container {
      min-height: 100vh;
      background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%);
      padding: 2rem;
    }

    .header {
      max-width: 1200px;
      margin: 0 auto 2rem;
    }

    .back-btn {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      display: inline-block;
      margin-bottom: 1rem;
    }

    .header h1 {
      color: #fff;
      margin: 0;
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
    }

    .stat-value {
      display: block;
      color: #fff;
      font-size: 2rem;
      font-weight: 700;
    }

    .stat-label {
      color: rgba(255, 255, 255, 0.5);
    }

    .rentals-table {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    th {
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.7);
      font-weight: 600;
    }

    td {
      color: #fff;
    }

    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      text-transform: uppercase;
    }

    .status.active {
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
    }

    .status.completed {
      background: rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
    }

    .status.cancelled {
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
    }

    .loading {
      text-align: center;
      color: rgba(255, 255, 255, 0.6);
      padding: 2rem;
    }
  `]
})
export class RentalManagementComponent {
    rentalsQuery = useAllRentalsQuery();

    getActiveCount(rentals: any[]): number {
        return rentals.filter(r => r.status === 'ACTIVE').length;
    }

    getTotalRevenue(rentals: any[]): number {
        return rentals
            .filter(r => r.status === 'COMPLETED')
            .reduce((sum, r) => sum + (r.totalPrice || 0), 0);
    }
}
