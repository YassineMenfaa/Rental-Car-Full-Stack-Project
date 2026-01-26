import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content container">
          <div class="hero-text animate-slideUp">
            <h1 class="hero-title">Find Your Perfect Ride</h1>
            <p class="hero-subtitle">
              Discover our premium fleet of vehicles. From economy to luxury,
              we have the perfect car for every journey.
            </p>
            <div class="hero-actions">
              <a routerLink="/cars" class="btn btn-primary btn-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Browse Cars
              </a>
              <a routerLink="/register" class="btn btn-outline-light btn-lg">
                Create Account
              </a>
            </div>
          </div>

          <div class="hero-stats animate-fadeIn">
            <div class="stat-card">
              <div class="stat-number">500+</div>
              <div class="stat-label">Cars Available</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">10k+</div>
              <div class="stat-label">Happy Customers</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">24/7</div>
              <div class="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="container">
          <h2 class="section-title text-center mb-8">Why Choose Us?</h2>

          <div class="features-grid">
            <div class="feature-card animate-slideUp">
              <div class="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>Secure Booking</h3>
              <p>Your payments and personal information are protected with industry-standard encryption.</p>
            </div>

            <div class="feature-card animate-slideUp" style="animation-delay: 100ms">
              <div class="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>Easy & Fast</h3>
              <p>Book your car in minutes. No paperwork, no hassle. Just pick and go.</p>
            </div>

            <div class="feature-card animate-slideUp" style="animation-delay: 200ms">
              <div class="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3>Top Quality</h3>
              <p>All our vehicles are regularly maintained and inspected for your safety.</p>
            </div>

            <div class="feature-card animate-slideUp" style="animation-delay: 300ms">
              <div class="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3>Flexible Pickup</h3>
              <p>Choose from multiple pickup locations and return the car anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="container text-center">
          <h2 class="cta-title">Ready to Hit the Road?</h2>
          <p class="cta-subtitle">Be one of our satisfied customers who trust us for their car rental needs.</p>
          <a routerLink="/cars" class="btn btn-primary btn-lg">Start Exploring</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      background: #f8fafc;
      min-height: 100vh;
    }

    .hero {
      padding: var(--space-16) 0;
      min-height: 80vh;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0d9488 100%);
    }

    .hero-content {
      display: grid;
      gap: var(--space-12);
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      color: white;
      line-height: 1.1;
      margin-bottom: var(--space-4);
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.8);
      max-width: 500px;
      margin-bottom: var(--space-8);
    }

    .hero-actions {
      display: flex;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.9rem 2rem;
      border-radius: 1rem;
      font-weight: 700;
      font-size: 0.95rem;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
    }

    .btn-lg {
      padding: 1rem 2.5rem;
      font-size: 1rem;
    }

    .btn-outline-light {
      background: transparent;
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.5);
    }

    .btn-outline-light:hover {
      background: white;
      color: var(--color-primary);
      border-color: white;
    }

    .hero-stats {
      display: flex;
      gap: var(--space-6);
      flex-wrap: wrap;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: var(--radius-lg);
      padding: var(--space-4) var(--space-6);
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 800;
      color: var(--color-accent);
    }

    .stat-label {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      }

    .features {
      padding-top: 50px;
      padding-bottom: 50px;
    }

    .section-title {
      font-size: 2.25rem;
      margin-bottom: var(--space-8);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-6);
    }

    @media (max-width: 1024px) {
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .features-grid {
        grid-template-columns: 1fr;
      }

      .hero-title {
        font-size: 2.5rem;
      }
    }

    .feature-card {
      text-align: center;
      padding: var(--space-6);
      border-radius: var(--radius-xl);
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
      background: white;
    }

    .feature-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, var(--color-accent) 0%, #fbbf24 100%);
      border-radius: var(--radius-xl);
      color: #0f172a; /* Dark text on yellow icon for contrast */
      margin-bottom: var(--space-4);
    }

    .feature-card h3 {
      font-size: 1.25rem;
      margin-bottom: var(--space-2);
    }

    .feature-card p {
      color: var(--color-text-light);
      font-size: 0.9375rem;
      max-width: 250px; /* Force text wrapping */
      margin: 0 auto;   /* Center the restricted width text */
      line-height: 1.6;
    }

    .cta {
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      color: white;
      padding: var(--space-16) 0;
    }

    .cta-title {
      font-size: 2.25rem;
      color: white;
      margin-bottom: var(--space-4);
    }

    .cta-subtitle {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: var(--space-8);
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
  `]
})
export class HomeComponent { }
