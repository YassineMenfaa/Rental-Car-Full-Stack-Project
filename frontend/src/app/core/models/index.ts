// User related types
export interface User {
    id?: number;
    email: string;
    role: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
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
    fuelType?: 'Gasoline' | 'Electric' | 'Diesel' | 'Hybrid';
    transmission?: 'Manual' | 'Automatic';
    seats?: number;
    category?: 'Economy' | 'Compact' | 'Midsize' | 'SUV' | 'Luxury' | 'Sports';
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
