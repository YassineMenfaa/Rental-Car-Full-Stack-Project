import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Rental, CreateRentalRequest, MultiCarRentalRequest } from '../models';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class RentalService {
    private readonly apiUrl = environment.rentalsUrl;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    createRental(request: CreateRentalRequest): Observable<Rental> {
        return this.http.post<Rental>(this.apiUrl, request, {
            headers: this.authService.getAuthHeaders()
        });
    }

    createMultiCarRental(request: MultiCarRentalRequest): Observable<Rental[]> {
        return this.http.post<Rental[]>(`${this.apiUrl}/multi`, request, {
            headers: this.authService.getAuthHeaders()
        });
    }

    returnCar(rentalId: number): Observable<Rental> {
        return this.http.post<Rental>(`${this.apiUrl}/${rentalId}/return`, {}, {
            headers: this.authService.getAuthHeaders()
        });
    }

    cancelRental(rentalId: number): Observable<Rental> {
        return this.http.post<Rental>(`${this.apiUrl}/${rentalId}/cancel`, {}, {
            headers: this.authService.getAuthHeaders()
        });
    }

    getMyRentals(): Observable<Rental[]> {
        return this.http.get<Rental[]>(`${this.apiUrl}/my`, {
            headers: this.authService.getAuthHeaders()
        });
    }

    getMyActiveRentals(): Observable<Rental[]> {
        return this.http.get<Rental[]>(`${this.apiUrl}/my/active`, {
            headers: this.authService.getAuthHeaders()
        });
    }

    getRentalById(id: number): Observable<Rental> {
        return this.http.get<Rental>(`${this.apiUrl}/${id}`, {
            headers: this.authService.getAuthHeaders()
        });
    }

    // Admin only
    getAllRentals(): Observable<Rental[]> {
        return this.http.get<Rental[]>(this.apiUrl, {
            headers: this.authService.getAuthHeaders()
        });
    }
}
