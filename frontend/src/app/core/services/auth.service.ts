import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, User } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'jwt_token';
    private readonly USER_KEY = 'user_data';

    private tokenSignal = signal<string | null>(this.getStoredToken());
    private userSignal = signal<User | null>(this.getStoredUser());

    readonly isAuthenticated = computed(() => !!this.tokenSignal());
    readonly currentUser = computed(() => this.userSignal());
    readonly token = computed(() => this.tokenSignal());
    readonly isAdmin = computed(() => this.userSignal()?.role === 'ADMIN');

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    login(credentials: LoginRequest): Observable<string> {
        return this.http.post(`${environment.authUrl}/login`, credentials, { responseType: 'text' })
            .pipe(
                tap((token) => {
                    this.setToken(token);
                    this.decodeAndStoreUser(token);
                }),
                catchError((error) => {
                    console.error('Login failed:', error);
                    return throwError(() => new Error(error.error || 'Login failed'));
                })
            );
    }

    register(data: RegisterRequest): Observable<User> {
        return this.http.post<User>(`${environment.authUrl}/register`, data)
            .pipe(
                catchError((error) => {
                    console.error('Registration failed:', error);
                    let errorMessage = 'Registration failed';
                    if (error.error instanceof ProgressEvent) {
                        errorMessage = 'Connection refused. Is the backend running?';
                    } else if (typeof error.error === 'string') {
                        errorMessage = error.error;
                    } else if (error.error?.message) {
                        errorMessage = error.error.message;
                    } else if (error.status === 0) {
                        errorMessage = 'Unable to connect to server. Check your internet connection or server status.';
                    }
                    return throwError(() => new Error(errorMessage));
                })
            );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.tokenSignal.set(null);
        this.userSignal.set(null);
        this.router.navigate(['/login']);
    }

    private setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
        this.tokenSignal.set(token);
    }

    private getStoredToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    private getStoredUser(): User | null {
        const userData = localStorage.getItem(this.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    private decodeAndStoreUser(token: string): void {
        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            const user: User = {
                email: decoded.sub,
                role: decoded.role || 'USER'
            };
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
            this.userSignal.set(user);
        } catch (error) {
            console.error('Failed to decode token:', error);
        }
    }

    getAuthHeaders(): { Authorization: string } | {} {
        const token = this.tokenSignal();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
}
