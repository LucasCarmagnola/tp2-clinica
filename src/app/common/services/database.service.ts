import { Injectable } from '@angular/core';
import { Especialista, Usuario } from '../classes/usuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  userDatabase : any

  constructor(private firestore: AngularFirestore, private authService : AuthService) {
    const user = this.authService.user
    if(user){
      this.obtenerUserPorID('usuarios', user.uid).subscribe((userDatabase) => {
        this.userDatabase = userDatabase
      })
    }

   }

  agregarUsuario(usuario : Usuario, coleccion : string){
    const colUsuarios = this.firestore.collection(coleccion)
    const documento = colUsuarios.doc(usuario.uid)

    documento.set({...usuario})
    console.log('Estoy En el service. Agregando usuario a la base de datos.')
  }

  traerUsuarios(){
    const colUsuarios = this.firestore.collection('usuarios', ref => ref.orderBy('tipoUsuario', 'asc'))
    return colUsuarios.valueChanges()
  }

  activarEspecialista(uid: string){
    const colUsuarios = this.firestore.collection('usuarios');
    const documento = colUsuarios.doc(uid);
    documento.update({ isActive: true })
      .then(() => console.log("Usuario activado exitosamente"))
      .catch(error => console.error("Error al activar usuario: ", error));
  }

  desactivarEspecialista(uid: string){
    const colUsuarios = this.firestore.collection('usuarios');
    const documento = colUsuarios.doc(uid);
    documento.update({ isActive: false })
      .then(() => console.log("Usuario desactivado exitosamente"))
      .catch(error => console.error("Error al desactivar usuario: ", error));
  }

  obtenerUserPorID(coleccion : string, id : string) {
    const colPuntos = this.firestore.collection(coleccion);
    const documento = colPuntos.doc(id);
    return documento.get();
  }


}
