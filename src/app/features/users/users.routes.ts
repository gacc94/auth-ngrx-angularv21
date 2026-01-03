import { Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./presentation/pages/users/users'),
    },
];

export default routes;
