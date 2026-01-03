import { Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./presentation/pages/analytics/analytics'),
    },
];

export default routes;
