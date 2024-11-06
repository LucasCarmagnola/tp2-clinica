import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

export const authGuard: CanActivateFn = async (route, state) => {

    const authService = inject(AuthService)
    const auth = inject(Auth)
    const router = inject(Router)

    const userr = auth.currentUser
    const user = await authService.user
    console.log(`en el auth guard. userr: ${userr}`)
    console.log(`en el auth guard. user: ${user}`)

    const currentUser = await auth.authStateReady()
    const name = auth.name
    console.log(`en el auth guard. usercurrent123131223: ${currentUser}`)
    console.log(`name: ${name}`)

    if(user === null || user === undefined){
        router.navigate(['/login'], { queryParams : { returnUrl: state.url } });
        return false
    }else{
        return true
    }
};
