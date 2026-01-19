// User related types
export interface User {
    id?: number;
    username: string;
    role: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user?: User;
}

// Car related types
export interface Car {
    id: number;
    brand: string;
    model: string;
    year: number;
    owner?: string;
    pricePerDay: number;
    available: boolean;
    rentalCount?: number;
    imageUrl?: string;
    description?: string;
}

export interface CarSearchParams {
    brand?: string;
    model?: string;
    year?: number;
    available?: boolean;
}

// Rental related types
export interface Rental {
    id: number;
    carId: number;
    car?: CarInfo;
    userId: number;
    username: string;
    startDate: string;
    endDate: string;
    returnDate?: string;
    pricePerDay: number;
    totalPrice: number;
    latePenalty?: number;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface CarInfo {
    id: number;
    brand: string;
    model: string;
    year: number;
    pricePerDay: number;
    imageUrl?: string;
}

export interface CreateRentalRequest {
    carId: number;
    startDate: string;
    endDate: string;
}

export interface MultiCarRentalRequest {
    carIds: number[];
    startDate: string;
    endDate: string;
}
