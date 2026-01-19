import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { AuthService, RentalService } from '../../../core/services';
import { useMyRentalsQuery, useReturnCarMutation, useCancelRentalMutation, queryKeys } from '../../../core/queries';
import { Rental } from '../../../core/models';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-my-rentals',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="rentals-header animate-fade-in">
        <div class="header-content">
          <a routerLink="/dashboard" class="back-link">← Back to Dashboard</a>
          <h1>My Rentals</h1>
          <p class="subtitle">Manage your active and past reservations</p>
        </div>
      </div>

      <div class="content-wrapper animate-fade-in" style="animation-delay: 0.1s">
        @if (rentalsQuery.isPending()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading your rentals...</p>
          </div>
        } @else if (rentalsQuery.isError() || !rentalsQuery.data()?.length) {
          <div class="empty-state glass-panel">
            <h2>No Rentals Found</h2>
            <p>You haven't rented any cars yet. Your journey starts here!</p>
            <a routerLink="/cars" class="btn btn-primary">Explore Our Collection</a>
          </div>
        } @else {
          @if (rentalsQuery.data(); as rentals) {
            <div class="tabs glass-panel">
              <button 
                class="tab-btn" 
                [class.active]="activeTab === 'all'"
                (click)="activeTab = 'all'"
              >
                All <span class="count">{{ rentals.length }}</span>
              </button>
              <button 
                class="tab-btn" 
                [class.active]="activeTab === 'active'"
                (click)="activeTab = 'active'"
              >
                Active <span class="count">{{ getActiveRentals(rentals).length }}</span>
              </button>
              <button 
                class="tab-btn" 
                [class.active]="activeTab === 'completed'"
                (click)="activeTab = 'completed'"
              >
                History <span class="count">{{ getCompletedRentals(rentals).length }}</span>
              </button>
            </div>

            <div class="rentals-grid">
              @for (rental of getFilteredRentals(rentals); track rental.id) {
                <div class="rental-card glass-panel" [class.active-rental]="rental.status === 'ACTIVE'">
                  <div class="card-header">
                    <div class="car-details">
                      <h3>{{ rental.car?.brand }} {{ rental.car?.model }}</h3>
                      <span class="status-badge" [class]="rental.status.toLowerCase()">
                        {{ rental.status }}
                      </span>
                    </div>
                    <div class="rental-ref">#{{ rental.id }}</div>
                  </div>

                  <div class="card-body">
                    <div class="info-group">
                      <label>Period</label>
                      <div class="value">{{ rental.startDate }} — {{ rental.endDate }}</div>
                    </div>
                    
                    <div class="info-row">
                      <div class="info-group">
                        <label>Rate</label>
                        <div class="value">{{ rental.pricePerDay | currency }}/day</div>
                      </div>
                      <div class="info-group">
                        <label>Total</label>
                        <div class="value total-price">{{ rental.totalPrice | currency }}</div>
                      </div>
                    </div>

                    @if (rental.latePenalty) {
                      <div class="penalty-alert">
                        <span>⚠️ Late Penalty</span>
                        <strong>{{ rental.latePenalty | currency }}</strong>
                      </div>
                    }

                    @if (rental.returnDate) {
                      <div class="return-info">
                        Returned on {{ rental.returnDate }}
                      </div>
                    }
                  </div>

                  @if (rental.status === 'ACTIVE') {
                    <div class="card-actions">
                      <button 
                        class="btn btn-primary full-width"
                        (click)="returnRental(rental.id)"
                        [disabled]="processingId === rental.id"
                      >
                        {{ processingId === rental.id ? 'Processing...' : 'Return Vehicle' }}
                      </button>
                      <button 
                        class="btn-text"
                        (click)="cancelRental(rental.id)"
                        [disabled]="processingId === rental.id"
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      padding: 2rem;
      background: var(--bg-body);
    }

    .rentals-header {
      margin-bottom: 3rem;
      text-align: center;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 1rem;
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .back-link:hover {
      color: var(--primary-600);
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      color: var(--text-muted);
      font-size: 1.1rem;
    }

    .content-wrapper {
      max-width: 1000px;
      margin: 0 auto;
    }

    .loading-state, .error-panel {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-muted);
    }

    .error-panel {
      max-width: 400px;
      margin: 0 auto;
    }

    .error-panel p {
      margin-bottom: 1.5rem;
      color: #ef4444;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(59, 130, 246, 0.1);
      border-top-color: var(--primary-600);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    .empty-state {
      text-align: center;
      padding: 5rem 2rem;
    }

    .empty-state h2 {
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: var(--text-muted);
      margin-bottom: 2rem;
    }

    /* Tabs */
    .tabs {
      display: flex;
      padding: 0.5rem;
      gap: 0.5rem;
      margin-bottom: 2rem;
      width: fit-content;
      margin-left: auto;
      margin-right: auto;
    }

    .tab-btn {
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-lg);
      border: none;
      background: transparent;
      color: var(--text-muted);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .tab-btn:hover {
      background: var(--bg-secondary);
      color: var(--text-main);
    }

    .tab-btn.active {
      background: white;
      color: var(--primary-600);
      box-shadow: var(--shadow-sm);
    }

    .count {
      background: var(--bg-secondary);
      padding: 0.1rem 0.5rem;
      border-radius: 20px;
      font-size: 0.75rem;
    }

    .tab-btn.active .count {
      background: var(--primary-50);
      color: var(--primary-600);
    }

    /* Grid & Cards */
    .rentals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
    }

    .rental-card {
      padding: 1.5rem;
      transition: transform 0.2s;
    }

    .rental-card:hover {
      transform: translateY(-2px);
    }

    .rental-card.active-rental {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1), var(--shadow-md);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }

    .car-details h3 {
      font-size: 1.25rem;
      margin: 0 0 0.5rem;
    }

    .rental-ref {
      font-family: monospace;
      color: var(--text-muted);
      font-size: 0.85rem;
    }

    .status-badge {
      display: inline-flex;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-badge.active {
      background: var(--primary-50);
      color: var(--primary-600);
    }

    .status-badge.completed {
      background: #dcfce7;
      color: #15803d;
    }

    .status-badge.cancelled {
      background: #fee2e2;
      color: #991b1b;
    }

    .card-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-group label {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .info-group .value {
      font-weight: 500;
      color: var(--text-main);
    }

    .info-row {
      display: flex;
      justify-content: space-between;
    }

    .total-price {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--primary-600);
    }

    .penalty-alert {
      background: #fef2f2;
      border: 1px solid #fee2e2;
      padding: 0.75rem;
      border-radius: var(--radius-lg);
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #b91c1c;
      font-size: 0.9rem;
    }

    .return-info {
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-muted);
      font-style: italic;
      padding-top: 0.5rem;
    }

    .card-actions {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .btn.full-width {
      width: 100%;
      justify-content: center;
    }

    .btn-text {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 0.85rem;
      padding: 0.5rem;
      cursor: pointer;
    }

    .btn-text:hover {
      color: #ef4444;
      text-decoration: underline;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class MyRentalsComponent {
  private queryClient = inject(QueryClient);
  private rentalService = inject(RentalService);

  rentalsQuery = useMyRentalsQuery();
  activeTab: 'all' | 'active' | 'completed' = 'all';
  processingId: number | null = null;

  getActiveRentals(rentals: Rental[]): Rental[] {
    return rentals.filter(r => r.status === 'ACTIVE');
  }

  getCompletedRentals(rentals: Rental[]): Rental[] {
    return rentals.filter(r => r.status === 'COMPLETED');
  }

  getFilteredRentals(rentals: Rental[]): Rental[] {
    switch (this.activeTab) {
      case 'active':
        return this.getActiveRentals(rentals);
      case 'completed':
        return this.getCompletedRentals(rentals);
      default:
        return rentals;
    }
  }

  async returnRental(id: number) {
    this.processingId = id;
    try {
      await lastValueFrom(this.rentalService.returnCar(id));
      this.queryClient.invalidateQueries({ queryKey: queryKeys.rentals.my });
      this.queryClient.invalidateQueries({ queryKey: queryKeys.cars.available });
    } catch (error) {
      console.error('Failed to return car:', error);
    } finally {
      this.processingId = null;
    }
  }

  async cancelRental(id: number) {
    this.processingId = id;
    try {
      await lastValueFrom(this.rentalService.cancelRental(id));
      this.queryClient.invalidateQueries({ queryKey: queryKeys.rentals.my });
      this.queryClient.invalidateQueries({ queryKey: queryKeys.cars.available });
    } catch (error) {
      console.error('Failed to cancel rental:', error);
    } finally {
      this.processingId = null;
    }
  }
}
