import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { map, of, switchMap } from 'rxjs';

export const authAdminGuard: CanActivateFn = async (route, state) => {

  const authService = inject(AuthService)
  const databaseService = inject(DatabaseService) //NO FUNCIONA, REVISAR JE HOY: 31 OCT
  const router = inject(Router)

  const currentUser = await authService.getCurrentUser()
  console.log(`en el guard: ${currentUser}`)
  if(!currentUser){return false}

  const user : any = await databaseService.obtenerUserPorID('usuarios', currentUser.uid).toPromise()
  console.log(`en el guard: ${user}`)
  return user?.exists && user.tipoUsuario === 'administrador'


// databaseService.obtenerUserPorID('usuarios', authService.user.uid).subscribe((user : any) => {
//   if(user.exists && user.tipoUsuario === 'administrador'){
//     return true
//   }else{
//     return false
//   }
// })
// return false

//const userAuth : any = authService.getCurrentUser()

  // let userDB = await databaseService.obtenerUserPorID('usuarios', user.uid).toPromise()
  // if(userDB?.exists){
  //   const usuario : any = userDB.data()
  //   if(usuario.tipoUsuario === 'administrador'){
  //     return true
  //   }else{
  //     return false
  //   }
  // }else{
  //   return false
  // }



};
