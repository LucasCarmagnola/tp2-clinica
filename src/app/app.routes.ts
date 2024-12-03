import { canActivate } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { authAdminGuard } from './common/guards/auth-admin.guard';
import { authGuard } from './common/guards/auth.guard';

export const routes: Routes = [
    {path : '', redirectTo : 'home', pathMatch : 'full'},
    {
        path : 'home', loadComponent : () => import('./common/components/home/home.component')
        .then((c) => c.HomeComponent),
    },
    {
        path : 'login', loadComponent : () => import('./common/components/login/login.component')
        .then((c) => c.LoginComponent)
    },
    {
        path : 'registro', loadComponent : () => import('./common/components/registro/registro.component')
        .then((c) => c.RegistroComponent)
    },
    {
        path : 'listaUsuarios', loadComponent : () => import('./common/components/lista-usuarios/lista-usuarios.component')
        .then((c) => c.ListaUsuariosComponent), //canActivate : [authAdminGuard]
    },
    {
        path : 'registro-admin', loadComponent : () => import('./common/components/registro-admin/registro-admin.component')
        .then((c) => c.RegistroAdminComponent), //canActivate : [authAdminGuard]
    },
    {
        path : 'conseguir-turno', loadComponent : () => import('./common/components/conseguir-turno/conseguir-turno.component')
        .then((c) => c.ConseguirTurnoComponent),  //canActivate : [authGuard]
    },
    {
        path : 'mis-horarios', loadComponent : () => import('./common/components/mis-horarios/mis-horarios.component')
        .then((c) => c.MisHorariosComponent),  //canActivate : [authGuard]
    },
    {
        path : 'mis-turnos', loadComponent : () => import('./common/components/turnos/turnos.component')
        .then((c) => c.TurnosComponent),  //canActivate : [authGuard]
    },
    {
        path : 'historias-clinicas', loadComponent : () => import('./common/components/historias-clinicas/historias-clinicas.component')
        .then((c) => c.HistoriasClinicasComponent),  //canActivate : [authGuard]
    },
    {
        path : 'estadisticas', loadComponent : () => import('./common/components/estadisticas/estadisticas.component')
        .then((c) => c.EstadisticasComponent), // canActivate : [authGuard]
    },

];
