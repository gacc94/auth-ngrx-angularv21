import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./presentation/pages/layout/dashboard'),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./presentation/pages/home/home'),
            },
            {
                path: 'analytics',
                loadChildren: () => import('../analytics/analytics.routes'),
            },
            {
                path: 'users',
                loadChildren: () => import('../users/users.routes'),
            },
            {
                path: 'projects',
                loadChildren: () => import('../projects/projects.routes'),
            },
            {
                path: 'settings',
                loadChildren: () => import('@features/settings/settings.routes'),
            },
        ],
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    },
];

export default routes;
