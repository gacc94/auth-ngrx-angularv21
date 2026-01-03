import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./core/auth/auth.routes'),
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes'),
    },
    {
        path: '**',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
];
