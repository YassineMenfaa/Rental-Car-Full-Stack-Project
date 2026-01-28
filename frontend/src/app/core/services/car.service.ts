import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Car, CarSearchParams } from '../models';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class CarService {
    private readonly apiUrl = environment.carsUrl;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    getAllCars(): Observable<Car[]> {
        return this.http.get<Car[]>(this.apiUrl);
    }

    getAvailableCars(): Observable<Car[]> {
        return this.http.get<Car[]>(`${this.apiUrl}/available`);
    }

    getCarById(id: number): Observable<Car> {
        return this.http.get<Car>(`${this.apiUrl}/${id}`);
    }

    searchCars(params: CarSearchParams): Observable<Car[]> {
        let httpParams = new HttpParams();
        if (params.brand) httpParams = httpParams.set('brand', params.brand);
        if (params.model) httpParams = httpParams.set('model', params.model);
        if (params.year) httpParams = httpParams.set('year', params.year.toString());
        if (params.available !== undefined) httpParams = httpParams.set('available', params.available.toString());

        return this.http.get<Car[]>(`${this.apiUrl}/search`, { params: httpParams });
    }

    getRecommendations(): Observable<Car[]> {
        return this.http.get<Car[]>(`${this.apiUrl}/recommendations`);
    }

    createCar(car: Partial<Car>): Observable<Car> {
        return this.http.post<Car>(this.apiUrl, car, {
           
        });
    }

    updateCar(id: number, car: Partial<Car>): Observable<Car> {
        return this.http.put<Car>(`${this.apiUrl}/${id}`, car, {
        
        });
    }

    deleteCar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, {
        
        });
    }
}
