import { Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./presentation/pages/layout/dashboard'),
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    },
];

export default routes;
