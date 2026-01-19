import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'cars',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
        canActivate: [guestGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
        canActivate: [guestGuard]
    },
    {
        path: 'cars',
        loadComponent: () => import('./features/cars/car-list/car-list.component').then(m => m.CarListComponent)
    },
    {
        path: 'cars/:id',
        loadComponent: () => import('./features/cars/car-detail/car-detail.component').then(m => m.CarDetailComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'my-rentals',
        loadComponent: () => import('./features/rentals/my-rentals/my-rentals.component').then(m => m.MyRentalsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
            {
                path: 'cars',
                loadComponent: () => import('./features/admin/car-management/car-management.component').then(m => m.CarManagementComponent)
            },
            {
                path: 'rentals',
                loadComponent: () => import('./features/admin/rental-management/rental-management.component').then(m => m.RentalManagementComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'cars'
    }
];
