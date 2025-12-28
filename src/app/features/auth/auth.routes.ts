import { Routes } from '@angular/router';
import { publicGuard } from '@core/guards/public.guard';

const routes: Routes = [
    {
        path: 'sign-in',
        loadComponent: () => import('./presentation/pages/sign-in/sign-in'),
        canActivate: [publicGuard],
    },
    {
        path: 'register',
        loadComponent: () => import('./presentation/pages/register/register'),
        canActivate: [publicGuard],
    },
    {
        path: '**',
        redirectTo: 'sign-in',
        pathMatch: 'full',
    },
];

export default routes;
