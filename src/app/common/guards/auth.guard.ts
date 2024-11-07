import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { pipe } from 'rxjs';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = async (route, state) => {

    const authService = inject(AuthService)
    const auth = inject(Auth)
    const router = inject(Router)
    
    // return authService.usuarioObservable$.pipe(
    //     take(1), // Solo toma el primer valor del observable (cuando Firebase emite el estado del usuario)
    //     map(user => {
    //         if (user) {
    //             // Usuario autenticado, permite el acceso
    //             console.log('aca se deberia permitir el acceso', user)
    //             return true;
    //         } else {
    //             // Usuario no autenticado, redirige al login
    //             console.log('aca no permite acceso. USER: ', user)
    //             router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    //             return false;
    //         }
    //     })
    // );
    const userr = auth.currentUser
    const user = await authService.user
    console.log(`en el auth guard. userr: ${userr}`)
    console.log(`en el auth guard. user: ${user}`)

    if(user === null || user === undefined){
        router.navigate(['/login'], { queryParams : { returnUrl: state.url } });
        return false
    }else{
        return true
    }

};
