import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { useCarsQuery, useSearchCarsQuery, useCarRecommendationsQuery } from '../../../core/queries';
import { CarSearchParams, Car } from '../../../core/models';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container car-list-view">
      <!-- Hero Section -->
      <section class="hero-section animate-fade-in">
        <div class="hero-content">
          <span class="badge-premium">Premium Collection</span>
          <h1>Experience Luxury <br/>on Every Journey</h1>
          <p>Choose from our curated selection of high-end vehicles, maintained to perfection for your exceptional driving experience.</p>
        </div>
      </section>

      <div class="main-content container">
        <!-- Search & Filters -->
        <aside class="filters-sidebar animate-fade-in" style="animation-delay: 0.1s">
          <div class="glass-panel filter-card">
            <div class="filter-header">
              <h3>Refine Search</h3>
              <button (click)="resetFilters()" class="btn-modern-reset">Reset</button>
            </div>
            
            <div class="filter-group">
              <label>Search Vehicles</label>
              <div class="search-input">
                <input 
                  type="text" 
                  [(ngModel)]="searchBrand"
                  placeholder="Brand (e.g. BMW)"
                  (input)="onSearch()"
                />
              </div>
              <div class="search-input mt-2">
                <input 
                  type="text" 
                  [(ngModel)]="searchModel"
                  placeholder="Model (e.g. M4)"
                  (input)="onSearch()"
                />
              </div>
            </div>

            <div class="filter-group">
              <label>Model Year</label>
              <select [(ngModel)]="searchYear" (change)="onSearch()">
                <option value="">All Years</option>
                @for (year of years; track year) {
                  <option [value]="year">{{ year }}</option>
                }
              </select>
            </div>

            <div class="filter-group">
              <label>Budget Range</label>
              <div class="budget-inputs">
                <input 
                  type="number" 
                  [(ngModel)]="minPrice"
                  placeholder="Min $/day"
                  (input)="onSearch()"
                  min="0"
                />
                <span class="budget-separator">to</span>
                <input 
                  type="number" 
                  [(ngModel)]="maxPrice"
                  placeholder="Max $/day"
                  (input)="onSearch()"
                  min="0"
                />
              </div>
            </div>

            <div class="filter-group">
              <label>Fuel Type</label>
              <select [(ngModel)]="selectedFuelType" (change)="onSearch()">
                <option value="">All Fuel Types</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Electric">Electric</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Transmission</label>
              <select [(ngModel)]="selectedTransmission" (change)="onSearch()">
                <option value="">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Category</label>
              <select [(ngModel)]="selectedCategory" (change)="onSearch()">
                <option value="">All Categories</option>
                <option value="Economy">Economy</option>
                <option value="Compact">Compact</option>
                <option value="Midsize">Midsize</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Seats</label>
              <select [(ngModel)]="selectedSeats" (change)="onSearch()">
                <option value="">Any Seats</option>
                <option value="2">2 Seats</option>
                <option value="4">4 Seats</option>
                <option value="5">5 Seats</option>
                <option value="7">7+ Seats</option>
              </select>
            </div>

            <div class="filter-group available-toggle-group">
              <span class="toggle-group-label">Available Only</span>
              <label class="toggle-container-vertical">
                <input 
                  type="checkbox" 
                  [(ngModel)]="onlyAvailable"
                  (change)="onSearch()"
                />
                <span class="toggle-track"></span>
              </label>
            </div>
          </div>

          <!-- Quick Stat/Promo -->
          <div class="glass-panel promo-card turquoise-theme mt-5">
            <h4>Weekend Special</h4>
            <p>Rent for 3 days, get 1 day free. Only this month!</p>
          </div>
        </aside>

        <!-- Results Area -->
        <main class="results-area">
          @if (recommendationsQuery.data()?.length && !searchBrand && !searchModel) {
            <div class="recommendations-section animate-fade-in" style="animation-delay: 0.2s">
              <div class="section-header">
                <h3 class="expert-picks-title">Our Expert Picks</h3>
                <span class="badge-outline">Handpicked for you</span>
              </div>
              <div class="recommendation-grid">
                @for (car of recommendationsQuery.data()!.slice(0, 3); track car.id) {
                  <a [routerLink]="['/cars', car.id]" class="recommend-card glass-panel">
                    <div class="img-wrapper">
                      <img [src]="car.imageUrl || 'https://via.placeholder.com/300x200?text=' + car.brand" [alt]="car.brand">
                    </div>
                    <div class="card-info">
                      <span class="category">{{ car.year }}</span>
                      <h4>{{ car.brand }} {{ car.model }}</h4>
                      <div class="price-row">
                        <span class="price">{{ car.pricePerDay | currency }}</span>
                        <span class="unit">/day</span>
                      </div>
                    </div>
                  </a>
                }
              </div>
            </div>
          }

          <div class="all-cars-section mt-5">
            <div class="results-header-modern mt-5">
              <div class="header-text">
                <span class="eyebrow">FLEET SELECTION</span>
                <h3>Available Vehicles</h3>
              </div>
              <span class="count-badge animate-in">{{ displayedCars().length }} units</span>
            </div>

            @if (carsQuery.isPending()) {
              <div class="loading-state">
                <div class="spinner"></div>
                <p>Curating our collection...</p>
              </div>
            }

            @if (carsQuery.isError()) {
              <div class="status-panel error-glass animate-in">
                <div class="panel-content">
                  <span class="status-label">CONNECTION INTERRUPTED</span>
                  <h4>System unreachable</h4>
                  <p>Unable to synchronize with the fleet database. Please verify your link.</p>
                  <button class="btn-neon-action" (click)="carsQuery.refetch()">Synchronize System</button>
                </div>
              </div>
            }

            <div class="car-grid">
              @for (car of displayedCars(); track car.id) {
                <div class="car-card premium-card glass-panel animate-fade-in" [class.unavailable]="!car.available">
                  <div class="image-section">
                    <img [src]="car.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'" [alt]="car.brand">
                    <div class="status-overlay">
                      <span class="badge" [class]="car.available ? 'available' : 'rented'">
                        {{ car.available ? 'Available' : 'Currently Rented' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="content-section">
                    <div class="header-row">
                      <div class="title-group">
                        <span class="year-label">{{ car.year }}</span>
                        <h4>{{ car.brand }} {{ car.model }}</h4>
                      </div>
                      <div class="price-box">
                        <span class="amt">{{ car.pricePerDay | currency }}</span>
                        <span class="unit">/day</span>
                      </div>
                    </div>

                    <div class="specs-grid">
                      <div class="spec-item">
                        <span>{{ car.transmission || 'Auto' }}</span>
                      </div>
                      <div class="spec-item">
                        <span>{{ car.seats || 5 }} Seats</span>
                      </div>
                      <div class="spec-item">
                        <span>{{ car.fuelType || 'Hybrid' }}</span>
                      </div>
                    </div>

                    <div class="action-row">
                      <a [routerLink]="['/cars', car.id]" class="btn-premium-action">
                        View Detailed Specs <span class="arrow">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              }
            </div>

            @if (!carsQuery.isPending() && displayedCars().length === 0) {
              <div class="status-panel empty-glass animate-in">
                <div class="panel-content">
                  <span class="status-label">ZERO MATCHES</span>
                  <h4>No Units <span class="highlight">Found</span></h4>
                  <p>Refine your parameters or reset the search to view our full collection.</p>
                  <button (click)="resetFilters()" class="btn-neon-action">Reset Parameters</button>
                </div>
              </div>
            }
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .car-list-view {
      background: var(--bg-body);
      min-height: 100vh;
    }

    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 8rem 2rem 10rem;
      text-align: center;
      position: relative;
      overflow: hidden;
      margin-bottom: -5rem;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2000') center/cover no-repeat;
      opacity: 0.15;
    }

    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 800px;
      margin: 0 auto;
    }

    .badge-premium {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.5rem 1.25rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      display: inline-block;
      margin-bottom: 2rem;
    }

    .hero-section h1 {
      font-size: 4rem;
      font-weight: 800;
      color: white;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      letter-spacing: -0.04em;
    }

    .hero-section p {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.25rem;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Layout Structure */
    .main-content {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 3rem;
      position: relative;
      z-index: 2;
      align-items: start;
    }

    /* Sidebar Filters */
    .filters-sidebar {
      position: sticky;
      top: 6rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .filter-card {
      padding: 2rem;
    }

    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .filter-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
    }

    .btn-modern-reset {
      background: rgba(15, 23, 42, 0.05);
      border: 1px solid var(--border);
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-md);
      font-size: 0.65rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-main);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-modern-reset:hover {
      background: #ef4444;
      color: white;
      border-color: #ef4444;
      transform: translateY(-1px);
    }

    .filter-group {
      margin-bottom: 2rem;
    }

    .filter-group:last-child { margin-bottom: 0; }

    .filter-group label, .toggle-group-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }

    .search-input input {
      padding: 0.875rem 1rem;
      width: 100%;
    }

    select {
      width: 100%;
      padding: 0.875rem 1rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      background: white;
      font-size: 0.95rem;
      cursor: pointer;
    }

    .budget-inputs {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .budget-inputs input {
      flex: 1;
      padding: 0.875rem 0.75rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      font-size: 0.9rem;
      width: 100%;
    }

    .budget-inputs input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .budget-separator {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .available-toggle-group {
      padding-top: 1.5rem;
      border-top: 1px dashed var(--border);
    }

    .toggle-container-vertical {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      width: fit-content;
    }

    .toggle-track {
      width: 52px;
      height: 28px;
      background: #e2e8f0; /* Light gray when OFF */
      border-radius: 14px;
      position: relative;
      transition: background 0.3s ease;
      flex-shrink: 0;
      cursor: pointer;
    }

    .toggle-track::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 24px;
      background: white;
      border-radius: 50%;
      top: 2px;
      left: 2px;
      transition: transform 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    input[type="checkbox"]:checked + .toggle-track {
      background: #10b981; /* Bright green when ON */
    }

    input[type="checkbox"]:checked + .toggle-track::after {
      transform: translateX(24px);
    }

    input[type="checkbox"] { display: none; }

    .promo-card {
      padding: 2.25rem;
      text-align: center;
      color: white;
      border: none;
      transition: transform 0.3s ease;
      position: relative;
    }

    .promo-card:hover {
      transform: scale(1.02);
    }

    .promo-card.turquoise-theme {
      background: linear-gradient(135deg, #40E0D0 0%, #008080 100%);
      box-shadow: 0 10px 25px rgba(64, 224, 208, 0.3);
    }

    .promo-card h4 { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.01em; }
    .promo-card p { font-size: 0.9rem; opacity: 0.9; font-weight: 500; }

    /* Results Area */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .section-header h3 {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .expert-picks-title {
      color: white !important;
      font-weight: 900;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }

    .badge-outline {
      padding: 0.35rem 1rem;
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: white;
      backdrop-filter: blur(4px);
      background: rgba(255,255,255,0.1);
    }

    /* Recommendation Cards */
    .recommendation-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 4rem;
    }

    .recommend-card {
      padding: 1rem;
      text-decoration: none;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .recommend-card:hover { transform: translateY(-8px); }

    .recommend-card .img-wrapper {
      height: 160px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .recommend-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .recommend-card:hover img { transform: scale(1.1); }

    .recommend-card .card-info .category {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--primary-600);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .recommend-card h4 { font-size: 1.1rem; margin: 0.25rem 0 0.75rem; }

    .recommend-card .price-row {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
    }

    .recommend-card .price { font-size: 1.25rem; font-weight: 800; color: var(--text-main); }

    /* Main Car Grid */
    .car-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 2rem;
    }

    .premium-card {
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow: hidden;
      border: 1px solid var(--border-light);
    }

    .premium-card .image-section {
      height: 260px;
      position: relative;
      overflow: hidden;
    }

    .premium-card .image-section img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s cubic-bezier(0.33, 1, 0.68, 1);
    }

    .premium-card:hover .image-section img { transform: scale(1.1); }

    .status-overlay {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
    }

    .badge {
      padding: 0.5rem 1rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 800;
      backdrop-filter: blur(8px);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge.available { background: rgba(16, 185, 129, 0.9); color: white; }
    .badge.rented { background: rgba(239, 68, 68, 0.9); color: white; }

    .content-section { padding: 2rem; }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .year-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--primary-500);
      background: var(--primary-50);
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      display: inline-block;
    }

    .title-group h4 {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-main);
      margin: 0;
    }

    .price-box { text-align: right; }
    .price-box .amt { font-size: 1.5rem; font-weight: 900; color: var(--text-main); display: block; }
    .price-box .unit { font-size: 0.85rem; color: var(--text-muted); }

    .specs-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      padding: 1.25rem 0;
      border-top: 1px solid var(--border-light);
      border-bottom: 1px solid var(--border-light);
      margin-bottom: 1.5rem;
    }

    .spec-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .spec-item .icon { font-size: 1rem; }

    .btn-premium-action {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      width: 100%;
      padding: 1rem;
      background: var(--bg-body);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      text-decoration: none;
      color: var(--text-main);
      font-weight: 700;
      transition: all 0.3s;
    }

    .btn-premium-action:hover {
      background: var(--text-main);
      color: white;
      border-color: var(--text-main);
    }

    .btn-premium-action .arrow {
      transition: transform 0.3s;
    }

    .btn-premium-action:hover .arrow {
      transform: translateX(5px);
    }

    /* States */
    .loading-state { text-align: center; padding: 4rem; }
    .empty-results {
      text-align: center;
      padding: 5rem 2rem;
      max-width: 400px;
      margin: 4rem auto;
    }
    .empty-results .icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.2; }

    /* Responsive */
    @media (max-width: 1024px) {
      .main-content { grid-template-columns: 1fr; }
      .filters-sidebar { position: static; }
      .hero-section h1 { font-size: 3rem; }
    }
    /* Modern Results Header */
    .results-header-modern {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2.5rem;
      border-bottom: 1px solid rgba(15, 23, 42, 0.05);
      padding-bottom: 1.5rem;
    }

    .results-header-modern .header-text {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .results-header-modern .eyebrow {
      font-size: 0.65rem;
      font-weight: 900;
      letter-spacing: 0.2em;
      color: #64748b;
      text-transform: uppercase;
    }

    .results-header-modern h3 {
      font-size: 2rem;
      font-weight: 300;
      margin: 0;
      color: #1e293b;
      letter-spacing: -0.02em;
    }

    .count-badge {
      background: #0f172a;
      color: #2dd4bf;
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
    }

    /* Modern Status Panels (Error/Empty) */
    .status-panel {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(15, 23, 42, 0.06);
      border-radius: 3rem;
      padding: 5rem 3rem;
      text-align: center;
      backdrop-filter: blur(20px);
      margin: 2rem 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .error-glass {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.01) 100%);
      border-color: rgba(239, 68, 68, 0.1);
    }

    .empty-glass {
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.03) 0%, rgba(15, 23, 42, 0.01) 100%);
    }

    .panel-content {
      max-width: 450px;
    }

    .status-label {
      font-size: 0.7rem;
      font-weight: 900;
      letter-spacing: 0.25em;
      color: #94a3b8;
      text-transform: uppercase;
      display: block;
      margin-bottom: 1.5rem;
    }

    .status-panel h4 {
      font-size: 2.5rem;
      font-weight: 300;
      margin: 0 0 1rem;
      color: #1e293b;
      letter-spacing: -0.03em;
    }

    .status-panel h4 .highlight {
      font-weight: 800;
      color: #0f172a;
    }

    .status-panel p {
      font-size: 1.1rem;
      color: #64748b;
      margin-bottom: 2.5rem;
      line-height: 1.6;
    }

    .btn-neon-action {
      background: #0f172a;
      color: white;
      border: none;
      padding: 1rem 2.5rem;
      border-radius: var(--radius-full);
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
      box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2);
    }

    .btn-neon-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(15, 23, 42, 0.3);
      color: #2dd4bf;
    }

    .error-glass .btn-neon-action:hover {
      color: #ef4444;
    }
  `]
})
export class CarListComponent {
  authService = inject(AuthService);

  carsQuery = useCarsQuery();
  recommendationsQuery = useCarRecommendationsQuery();

  searchBrand = '';
  searchModel = '';
  searchYear = '';
  onlyAvailable = false;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedFuelType = '';
  selectedTransmission = '';
  selectedCategory = '';
  selectedSeats = '';

  years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  displayedCars = signal<Car[]>([]);

  constructor() {
    effect(() => {
      const cars = this.carsQuery.data();
      if (cars) {
        this.filterCars();
      }
    });
  }

  onSearch() {
    this.filterCars();
  }

  resetFilters() {
    this.searchBrand = '';
    this.searchModel = '';
    this.searchYear = '';
    this.onlyAvailable = false;
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedFuelType = '';
    this.selectedTransmission = '';
    this.selectedCategory = '';
    this.selectedSeats = '';
    this.filterCars();
  }

  private filterCars() {
    const cars = this.carsQuery.data() || [];
    let filtered = [...cars];

    if (this.searchBrand) {
      filtered = filtered.filter(car =>
        car.brand.toLowerCase().includes(this.searchBrand.toLowerCase())
      );
    }

    if (this.searchModel) {
      filtered = filtered.filter(car =>
        car.model.toLowerCase().includes(this.searchModel.toLowerCase())
      );
    }

    if (this.searchYear) {
      filtered = filtered.filter(car =>
        car.year === parseInt(this.searchYear)
      );
    }

    if (this.onlyAvailable) {
      filtered = filtered.filter(car => car.available);
    }

    if (this.minPrice !== null && this.minPrice > 0) {
      filtered = filtered.filter(car => car.pricePerDay >= this.minPrice!);
    }

    if (this.maxPrice !== null && this.maxPrice > 0) {
      filtered = filtered.filter(car => car.pricePerDay <= this.maxPrice!);
    }

    if (this.selectedFuelType) {
      filtered = filtered.filter(car => car.fuelType === this.selectedFuelType);
    }

    if (this.selectedTransmission) {
      filtered = filtered.filter(car => car.transmission === this.selectedTransmission);
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(car => car.category === this.selectedCategory);
    }

    if (this.selectedSeats) {
      const seatsNum = parseInt(this.selectedSeats);
      if (seatsNum === 7) {
        filtered = filtered.filter(car => (car.seats || 5) >= 7);
      } else {
        filtered = filtered.filter(car => (car.seats || 5) === seatsNum);
      }
    }

    this.displayedCars.set(filtered);
  }
}
