import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./presentation/pages/layout/dashboard'),
        canActivate: [authGuard],
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    },
];

export default routes;
