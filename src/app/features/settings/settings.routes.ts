import { Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./presentation/pages/settings/settings'),
    },
];

export default routes;
