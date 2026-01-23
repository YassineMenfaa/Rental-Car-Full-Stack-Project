import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { useCarsQuery, queryKeys } from '../../../core/queries';
import { AuthService, CarService } from '../../../core/services';
import { Car } from '../../../core/models';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-car-management',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="admin-container">
      <header class="header">
        <a routerLink="/dashboard" class="back-btn">← Dashboard</a>
        <h1>Car Management</h1>
        <button class="btn-add" (click)="openModal()">+ Add Car</button>
      </header>

      <main class="content">
        @if (carsQuery.isPending()) {
          <div class="loading">Loading...</div>
        }

        @if (carsQuery.data(); as cars) {
          <div class="cars-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Year</th>
                  <th>Price/Day</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (car of cars; track car.id) {
                  <tr>
                    <td>{{ car.id }}</td>
                    <td>{{ car.brand }}</td>
                    <td>{{ car.model }}</td>
                    <td>{{ car.year }}</td>
                    <td>{{ car.pricePerDay | currency }}</td>
                    <td>
                      <span class="status" [class.available]="car.available" [class.rented]="!car.available">
                        {{ car.available ? 'Available' : 'Rented' }}
                      </span>
                    </td>
                    <td class="actions">
                      <button class="btn-edit" (click)="editCar(car)">Edit</button>
                      <button 
                        class="btn-delete" 
                        (click)="deleteCar(car.id)"
                        [disabled]="!car.available"
                      >Delete</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </main>

      <!-- Modal -->
      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <h2>{{ editingCar() ? 'Edit Car' : 'Add New Car' }}</h2>
            
            @if (error()) {
                <div class="error-message">{{ error() }}</div>
            }

            <form (ngSubmit)="saveCar()">
              <div class="form-row">
                <div class="form-group">
                  <label>Brand</label>
                  <input type="text" [(ngModel)]="formData.brand" name="brand" required />
                </div>
                <div class="form-group">
                  <label>Model</label>
                  <input type="text" [(ngModel)]="formData.model" name="model" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Year</label>
                  <input type="number" [(ngModel)]="formData.year" name="year" required />
                </div>
                <div class="form-group">
                  <label>Price per Day</label>
                  <input type="number" [(ngModel)]="formData.pricePerDay" name="pricePerDay" step="0.01" required />
                </div>
              </div>

              <div class="form-group">
                <label>Owner</label>
                <input type="text" [(ngModel)]="formData.owner" name="owner" />
              </div>

              <div class="form-group">
                <label>Image URL</label>
                <input type="url" [(ngModel)]="formData.imageUrl" name="imageUrl" />
              </div>

              <div class="form-group">
                <label>Description</label>
                <textarea [(ngModel)]="formData.description" name="description" rows="3"></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Fuel Type</label>
                  <select [(ngModel)]="formData.fuelType" name="fuelType">
                    <option value="">Select Fuel Type</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Electric">Electric</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Transmission</label>
                  <select [(ngModel)]="formData.transmission" name="transmission">
                    <option value="">Select Transmission</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Category</label>
                  <select [(ngModel)]="formData.category" name="category">
                    <option value="">Select Category</option>
                    <option value="Economy">Economy</option>
                    <option value="Compact">Compact</option>
                    <option value="Midsize">Midsize</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Seats</label>
                  <select [(ngModel)]="formData.seats" name="seats">
                    <option value="">Select Seats</option>
                    <option [ngValue]="2">2 Seats</option>
                    <option [ngValue]="4">4 Seats</option>
                    <option [ngValue]="5">5 Seats</option>
                    <option [ngValue]="7">7 Seats</option>
                    <option [ngValue]="8">8+ Seats</option>
                  </select>
                </div>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn-cancel" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn-save" [disabled]="saving()">
                  {{ saving() ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
      padding: 2rem;
    }

    .header {
      max-width: 1280px;
      margin: 0 auto 2rem;
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .back-btn {
      color: #64748b;
      text-decoration: none;
      font-weight: 500;
    }

    .back-btn:hover {
      color: #0f172a;
    }

    .header h1 {
      color: #0f172a;
      flex: 1;
      margin: 0;
    }

    .btn-add {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-add:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .content {
      max-width: 1280px;
      margin: 0 auto;
    }

    .cars-table {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    th {
      background: #f8fafc;
      color: #64748b;
      font-weight: 600;
      font-size: 0.875rem;
    }

    td {
      color: #0f172a;
    }

    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .status.available {
      background: #dcfce7;
      color: #166534;
    }

    .status.rented {
      background: #fee2e2;
      color: #991b1b;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-edit {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      color: #2563eb;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }
    
    .btn-edit:hover {
      background: #e2e8f0;
    }

    .btn-delete {
      background: #fef2f2;
      border: 1px solid #fee2e2;
      color: #ef4444;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }
    
    .btn-delete:hover {
      background: #fee2e2;
    }

    .btn-delete:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      filter: grayscale(1);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 2rem;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
    }

    .modal h2 {
      color: #0f172a;
      margin: 0 0 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      color: #64748b;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 0.75rem;
      color: #0f172a;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    }

    .form-group select {
      width: 100%;
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 0.75rem;
      color: #0f172a;
      font-size: 1rem;
      cursor: pointer;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn-cancel {
      flex: 1;
      background: white;
      border: 1px solid #cbd5e1;
      color: #64748b;
      padding: 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
    }
    
    .btn-cancel:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    .btn-save {
      flex: 1;
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }
    
    .btn-save:hover {
      background: #1d4ed8;
    }

    .btn-save:disabled {
      opacity: 0.7;
      cursor: wait;
    }

    .error-message {
      background: #fef2f2;
      border: 1px solid #fee2e2;
      color: #991b1b;
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .loading {
      text-align: center;
      color: #64748b;
      padding: 2rem;
    }
  `]
})
export class CarManagementComponent {
  private queryClient = inject(QueryClient);
  private carService = inject(CarService);

  carsQuery = useCarsQuery();

  showModal = signal(false);
  editingCar = signal<Car | null>(null);
  saving = signal(false);

  formData = {
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    pricePerDay: 0,
    owner: '',
    imageUrl: '',
    description: '',
    fuelType: '',
    transmission: '',
    category: '',
    seats: null as number | null
  };

  openModal() {
    this.editingCar.set(null);
    this.resetForm();
    this.showModal.set(true);
  }

  editCar(car: Car) {
    this.editingCar.set(car);
    this.formData = {
      brand: car.brand,
      model: car.model,
      year: car.year,
      pricePerDay: car.pricePerDay,
      owner: car.owner || '',
      imageUrl: car.imageUrl || '',
      description: car.description || '',
      fuelType: car.fuelType || '',
      transmission: car.transmission || '',
      category: car.category || '',
      seats: car.seats || null
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingCar.set(null);
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      pricePerDay: 0,
      owner: '',
      imageUrl: '',
      description: '',
      fuelType: '',
      transmission: '',
      category: '',
      seats: null
    };
  }

  error = signal<string | null>(null);

  async saveCar() {
    this.error.set(null);
    this.saving.set(true);
    try {
      const editing = this.editingCar();
      if (editing) {
        await lastValueFrom(this.carService.updateCar(editing.id, this.formData as any));
      } else {
        await lastValueFrom(this.carService.createCar(this.formData as any));
      }
      this.queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
      this.closeModal();
      // Show a simple alert or toast if possible, or just rely on list update
    } catch (error: any) {
      console.error('Failed to save car:', error);
      const msg = error.error?.message || error.message || 'Failed to save car. Please check connection.';
      this.error.set(msg);
    } finally {
      this.saving.set(false);
    }
  }

  async deleteCar(id: number) {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      await lastValueFrom(this.carService.deleteCar(id));
      this.queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
    } catch (error) {
      console.error('Failed to delete car:', error);
    }
  }
}
