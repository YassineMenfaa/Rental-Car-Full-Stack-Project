import { inject } from '@angular/core';
import { injectQuery, injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { CarService, RentalService } from '../services';
import { Car, CarSearchParams, CreateRentalRequest, Rental } from '../models';
import { lastValueFrom } from 'rxjs';

// Query keys for cache management
export const queryKeys = {
    cars: {
        all: ['cars'] as const,
        available: ['cars', 'available'] as const,
        recommendations: ['cars', 'recommendations'] as const,
        search: (params: CarSearchParams) => ['cars', 'search', params] as const,
        detail: (id: number) => ['cars', id] as const,
    },
    rentals: {
        all: ['rentals'] as const,
        my: ['rentals', 'my'] as const,
        myActive: ['rentals', 'my', 'active'] as const,
        detail: (id: number) => ['rentals', id] as const,
    },
};

// Car queries
export function useCarsQuery() {
    const carService = inject(CarService);
    return injectQuery(() => ({
        queryKey: queryKeys.cars.all,
        queryFn: () => lastValueFrom(carService.getAllCars()),
    }));
}

export function useAvailableCarsQuery() {
    const carService = inject(CarService);
    return injectQuery(() => ({
        queryKey: queryKeys.cars.available,
        queryFn: () => lastValueFrom(carService.getAvailableCars()),
    }));
}

export function useCarRecommendationsQuery() {
    const carService = inject(CarService);
    return injectQuery(() => ({
        queryKey: queryKeys.cars.recommendations,
        queryFn: () => lastValueFrom(carService.getRecommendations()),
    }));
}

export function useCarDetailQuery(id: () => number) {
    const carService = inject(CarService);
    return injectQuery(() => ({
        queryKey: queryKeys.cars.detail(id()),
        queryFn: () => lastValueFrom(carService.getCarById(id())),
        enabled: id() > 0,
    }));
}

export function useSearchCarsQuery(params: () => CarSearchParams) {
    const carService = inject(CarService);
    return injectQuery(() => ({
        queryKey: queryKeys.cars.search(params()),
        queryFn: () => lastValueFrom(carService.searchCars(params())),
    }));
}

// Rental queries
export function useMyRentalsQuery() {
    const rentalService = inject(RentalService);
    return injectQuery(() => ({
        queryKey: queryKeys.rentals.my,
        queryFn: () => lastValueFrom(rentalService.getMyRentals()),
    }));
}

export function useMyActiveRentalsQuery() {
    const rentalService = inject(RentalService);
    return injectQuery(() => ({
        queryKey: queryKeys.rentals.myActive,
        queryFn: () => lastValueFrom(rentalService.getMyActiveRentals()),
    }));
}

export function useAllRentalsQuery() {
    const rentalService = inject(RentalService);
    return injectQuery(() => ({
        queryKey: queryKeys.rentals.all,
        queryFn: () => lastValueFrom(rentalService.getAllRentals()),
    }));
}

// Car mutations
export function useCreateCarMutation(queryClient: QueryClient) {
    const carService = inject(CarService);
    return injectMutation(() => ({
        mutationFn: (car: Partial<Car>) => lastValueFrom(carService.createCar(car)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
        },
    }));
}

export function useUpdateCarMutation(queryClient: QueryClient) {
    const carService = inject(CarService);
    return injectMutation(() => ({
        mutationFn: ({ id, car }: { id: number; car: Partial<Car> }) =>
            lastValueFrom(carService.updateCar(id, car)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
        },
    }));
}

export function useDeleteCarMutation(queryClient: QueryClient) {
    const carService = inject(CarService);
    return injectMutation(() => ({
        mutationFn: (id: number) => lastValueFrom(carService.deleteCar(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
        },
    }));
}

// Rental mutations
export function useCreateRentalMutation(queryClient: QueryClient) {
    const rentalService = inject(RentalService);
    return injectMutation(() => ({
        mutationFn: (request: CreateRentalRequest) =>
            lastValueFrom(rentalService.createRental(request)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.rentals.my });
            queryClient.invalidateQueries({ queryKey: queryKeys.cars.available });
        },
    }));
}

export function useReturnCarMutation(queryClient: QueryClient) {
    const rentalService = inject(RentalService);
    return injectMutation(() => ({
        mutationFn: (rentalId: number) => lastValueFrom(rentalService.returnCar(rentalId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.rentals.my });
            queryClient.invalidateQueries({ queryKey: queryKeys.cars.available });
        },
    }));
}

export function useCancelRentalMutation(queryClient: QueryClient) {
    const rentalService = inject(RentalService);
    return injectMutation(() => ({
        mutationFn: (rentalId: number) => lastValueFrom(rentalService.cancelRental(rentalId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.rentals.my });
            queryClient.invalidateQueries({ queryKey: queryKeys.cars.available });
        },
    }));
}
