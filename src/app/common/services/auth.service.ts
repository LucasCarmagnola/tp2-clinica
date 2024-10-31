import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { Usuario } from '../classes/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user:any;
  public emailVerified : boolean = false

  constructor(private auth : Auth) { 
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.user = user
        this.emailVerified = user.emailVerified
        console.log(`en el constructor del servicio. USER: ${user}`)
        console.log(`en el constructor del servicio. USER verificado: ${user.emailVerified}`)
        console.log(`en el constructor del servicio. Email: ${user.email}`)
      } else {
        this.user = null
        console.log(`en el constructor del servicio. No hay usuario logeado. USER: ${user}`);
      }
    });
  }

  registro(email : string, password : string){
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  enviarEmail(){
    sendEmailVerification(this.user)
  }

  // registro(usuario : Usuario, password : string){
  //   createUserWithEmailAndPassword(this.auth, usuario.email, password)
  //   .then((userCredential) => {
  //     this.actualizarNombre(usuario.nombre)
  //     const user = userCredential.user
  //     sendEmailVerification(user).then(()=>{
  //       console.log("Correo de verificación enviado.");
  //     }).catch((error)=>{
  //       console.error("Error al enviar correo de verificación:", error);
  //     })
  //   }).catch((error)=>{
  //     console.error("Error al registrar usuario:", error);
  //   })
  // }

  login(email : string, password : string){
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  logOut(){
    return signOut(this.auth)
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
  
  async actualizarNombre(nombre: string) {
    const auth = getAuth(); 
    const user = auth.currentUser;
    if (user) {
      // Verifica que el usuario esté autenticado
      try {
          await updateProfile(user, {
              displayName: nombre
          });
          console.log('Nombre actualizado correctamente:', nombre);
      } catch (error) {
          console.error('Error al actualizar el nombre:', error);
      }
    } else {
        console.log('No hay un usuario autenticado.');
    }

  }

  reestablecerPassword(email : string){
    sendPasswordResetEmail(this.auth, email)
  }


}
