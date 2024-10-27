import { Routes } from '@angular/router';

export const routes: Routes = [
    {path : '', redirectTo : 'home', pathMatch : 'full'},
    {
        path : 'home', loadComponent : () => import('./common/components/home/home.component')
        .then((c) => c.HomeComponent)
    },
    {
        path : 'login', loadComponent : () => import('./common/components/login/login.component')
        .then((c) => c.LoginComponent)
    },
    {
        path : 'registro', loadComponent : () => import('./common/components/registro/registro.component')
        .then((c) => c.RegistroComponent)
    }

];
