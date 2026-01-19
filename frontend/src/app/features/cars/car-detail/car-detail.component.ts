import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { useCarDetailQuery, useCreateRentalMutation, queryKeys } from '../../../core/queries';
import { AuthService } from '../../../core/services';
import { FormsModule } from '@angular/forms';
import { QueryClient } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="car-detail-container">
      <header class="header">
        <a routerLink="/cars" class="back-btn">← Back to Cars</a>
      </header>

      @if (carQuery.isPending()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading car details...</p>
        </div>
      }

      @if (carQuery.isError()) {
        <div class="error">
          <h2>Car Not Found</h2>
          <p>The requested car could not be found.</p>
          <a routerLink="/cars" class="btn-primary">Browse Cars</a>
        </div>
      }

      @if (carQuery.data(); as car) {
        <main class="car-detail">
          <div class="car-image-section">
            <div class="car-image" [style.background-image]="'url(' + (car.imageUrl || 'https://via.placeholder.com/800x500?text=' + car.brand + '+' + car.model) + ')'"></div>
            <div class="badge-container">
              @if (car.available) {
                <span class="badge available">Available Now</span>
              } @else {
                <span class="badge unavailable">Currently Rented</span>
              }
            </div>
          </div>

          <div class="car-info-section">
            <div class="car-header">
              <div>
                <h1>{{ car.brand }} {{ car.model }}</h1>
                <p class="year">{{ car.year }} Model</p>
              </div>
              <div class="price-tag">
                <span class="price">{{ car.pricePerDay | currency }}</span>
                <span class="per-day">per day</span>
              </div>
            </div>

            @if (car.description) {
              <div class="description">
                <h3>Description</h3>
                <p>{{ car.description }}</p>
              </div>
            }

            <div class="stats">
              <div class="stat">
                <span class="label">Owner</span>
                <span class="value">{{ car.owner || 'CarRental' }}</span>
              </div>
              <div class="stat">
                <span class="label">Rental Count</span>
                <span class="value">{{ car.rentalCount || 0 }} times</span>
              </div>
            </div>

            @if (car.available) {
              <div class="rental-form">
                <h3>Book This Car</h3>
                
                @if (!authService.isAuthenticated()) {
                  <div class="login-prompt">
                    <p>Please log in to rent this car</p>
                    <a routerLink="/login" class="btn-primary">Login to Rent</a>
                  </div>
                } @else {
                  @if (rentalError()) {
                    <div class="error-message">{{ rentalError() }}</div>
                  }
                  @if (rentalSuccess()) {
                    <div class="success-message">{{ rentalSuccess() }}</div>
                  }

                  <div class="date-inputs">
                    <div class="form-group">
                      <label>Start Date</label>
                      <input 
                        type="date" 
                        [(ngModel)]="startDate"
                        [min]="minDate"
                        (change)="calculateTotal()"
                      />
                    </div>
                    <div class="form-group">
                      <label>End Date</label>
                      <input 
                        type="date" 
                        [(ngModel)]="endDate"
                        [min]="startDate || minDate"
                        (change)="calculateTotal()"
                      />
                    </div>
                  </div>

                  @if (totalDays() > 0) {
                    <div class="total-section">
                      <div class="total-row">
                        <span>{{ totalDays() }} days × {{ car.pricePerDay | currency }}</span>
                        <span class="total">{{ totalPrice() | currency }}</span>
                      </div>
                    </div>
                  }

                  <button 
                    class="btn-rent" 
                    (click)="rentCar(car.id)"
                    [disabled]="!canRent() || isRenting()"
                  >
                    {{ isRenting() ? 'Processing...' : 'Rent Now' }}
                  </button>
                }
              </div>
            } @else {
              <div class="unavailable-notice">
                <p>This car is currently rented and not available for booking.</p>
                <p>Check back later or browse other available cars.</p>
                <a routerLink="/cars" class="btn-secondary">Browse Available Cars</a>
              </div>
            }
          </div>
        </main>
      }
    </div>
  `,
  styles: [`
    .car-detail-container {
      min-height: 100vh;
      background: #f8fafc;
    }

    .header {
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
    }

    .back-btn {
      color: #64748b;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .back-btn:hover {
      color: #0f172a;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #64748b;
    }

    .user-info button {
      background: white;
      border: 1px solid #e2e8f0;
      color: #64748b;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
    }
    
    .user-info button:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    .loading, .error {
      text-align: center;
      padding: 6rem 2rem;
      color: #64748b;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e2e8f0;
      border-top-color: #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1.5rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error h2 {
      color: #0f172a;
      margin-bottom: 1rem;
    }

    .car-detail {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem 4rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    @media (max-width: 968px) {
      .car-detail {
        grid-template-columns: 1fr;
      }
    }

    .car-image-section {
      position: relative;
    }

    .car-image {
      height: 400px;
      background-size: cover;
      background-position: center;
      border-radius: 24px;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    }

    .badge-container {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
    }

    .badge {
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      font-weight: 600;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }

    .badge.available {
      background: #22c55e;
      color: #fff;
    }

    .badge.unavailable {
      background: #ef4444;
      color: #fff;
    }

    .car-info-section {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .car-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .car-header h1 {
      color: #0f172a;
      font-size: 2.5rem;
      margin: 0;
    }

    .car-header .year {
      color: #64748b;
      margin: 0.5rem 0 0;
      font-size: 1.1rem;
    }

    .price-tag {
      text-align: right;
    }

    .price-tag .price {
      display: block;
      color: #2563eb;
      font-size: 2.5rem;
      font-weight: 700;
    }

    .price-tag .per-day {
      color: #64748b;
    }

    .description h3 {
      color: #0f172a;
      margin: 0 0 0.75rem;
    }

    .description p {
      color: #475569;
      line-height: 1.7;
      font-size: 1.05rem;
    }

    .stats {
      display: flex;
      gap: 3rem;
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat .label {
      color: #64748b;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .stat .value {
      color: #0f172a;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .rental-form {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
    }

    .rental-form h3 {
      color: #0f172a;
      margin: 0 0 1.5rem;
    }

    .login-prompt {
      text-align: center;
      padding: 2rem 0;
    }

    .login-prompt p {
      color: #64748b;
      margin-bottom: 1rem;
    }

    .date-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      color: #475569;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .form-group input {
      width: 100%;
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 0.875rem;
      color: #0f172a;
      font-size: 1rem;
    }

    .total-section {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      color: #166534;
      font-weight: 500;
    }

    .total-row .total {
      color: #15803d;
      font-weight: 700;
      font-size: 1.25rem;
    }

    .btn-rent {
      width: 100%;
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 1rem;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-rent:hover:not(:disabled) {
      background: #1d4ed8;
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
      transform: translateY(-1px);
    }

    .btn-rent:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: #94a3b8;
    }

    .btn-primary {
      display: inline-block;
      background: #2563eb;
      color: #fff;
      padding: 1rem 2rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
    }

    .btn-secondary {
      display: inline-block;
      background: white;
      border: 1px solid #e2e8f0;
      color: #475569;
      padding: 1rem 2rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .btn-secondary:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    .unavailable-notice {
      background: #fff1f2;
      border: 1px solid #ffe4e6;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
    }

    .unavailable-notice p {
      color: #9f1239;
      margin: 0 0 1rem;
      font-weight: 500;
    }

    .error-message {
      background: #fef2f2;
      border: 1px solid #fee2e2;
      color: #991b1b;
      padding: 1rem;
      border-radius: 10px;
      margin-bottom: 1rem;
    }

    .success-message {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 1rem;
      border-radius: 10px;
      margin-bottom: 1rem;
    }
  `]
})
export class CarDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private queryClient = inject(QueryClient);
  authService = inject(AuthService);

  carId = signal(0);
  carQuery = useCarDetailQuery(() => this.carId());

  startDate = '';
  endDate = '';
  minDate = new Date().toISOString().split('T')[0];

  totalDays = signal(0);
  totalPrice = signal(0);
  createRentalMutation = useCreateRentalMutation(this.queryClient);
  isRenting = computed(() => this.createRentalMutation.isPending());
  rentalError = signal<string | null>(null);
  rentalSuccess = signal<string | null>(null);

  constructor() {
    this.route.params.subscribe(params => {
      this.carId.set(parseInt(params['id'], 10));
    });
  }

  calculateTotal() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays > 0) {
        this.totalDays.set(diffDays);
        const car = this.carQuery.data();
        if (car) {
          this.totalPrice.set(diffDays * car.pricePerDay);
        }
      } else {
        this.totalDays.set(0);
        this.totalPrice.set(0);
      }
    }
  }

  canRent(): boolean {
    return !!(this.startDate && this.endDate && this.totalDays() > 0);
  }

  async rentCar(carId: number) {
    if (!this.canRent()) return;

    this.rentalError.set(null);
    this.rentalSuccess.set(null);

    try {
      await this.createRentalMutation.mutateAsync({
        carId,
        startDate: this.startDate,
        endDate: this.endDate
      });

      this.rentalSuccess.set('Car rented successfully! Redirecting...');
      this.queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });

      setTimeout(() => {
        this.router.navigate(['/my-rentals']);
      }, 2000);
    } catch (err: any) {
      console.error('Rental failed:', err);
      this.rentalError.set(err.message || err.error || 'Failed to rent car');
    }
  }
}
