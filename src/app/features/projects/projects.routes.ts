import { Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./presentation/pages/projects/projects'),
    },
];

export default routes;
