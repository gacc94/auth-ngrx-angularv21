import { Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'sign-in',
        loadComponent: () => import('./presentation/pages/sign-in/sign-in'),
    },
];

export default routes;
