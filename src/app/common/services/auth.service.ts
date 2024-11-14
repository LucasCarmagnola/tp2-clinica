import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile, User, user } from '@angular/fire/auth';
import { Usuario } from '../classes/usuario';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<any>(null)
  public usuarioObservable$ : Observable<any> = this.userSubject.asObservable()

  public user:any;
  public emailVerified : boolean = false
  private uidSubject = new BehaviorSubject<string | null>(null);
  uid$ = this.uidSubject.asObservable();

  secondaryApp: FirebaseApp;
  secondaryAuth: Auth;


  constructor(private auth : Auth) { 
    this.secondaryApp = initializeApp(environment.firebaseConfig, 'secondary')
    this.secondaryAuth = getAuth(this.secondaryApp)
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userSubject.next(user);
        this.user = user
        this.emailVerified = user.emailVerified
        this.uidSubject.next(user.uid);

        console.log(`en el constructor del servicio. Email: ${user.email}`)
      } else {
        this.userSubject.next(null);
        this.user = null
        this.uidSubject.next(null);
        console.log(`en el constructor del servicio. No hay usuario logeado. USER: ${user}`);
      }
    });
  }

  get uid(): string | null {
    return this.uidSubject.value;
  }

  registro(email : string, password : string){
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  registroSecundario(email : string, password : string){
    return createUserWithEmailAndPassword(this.secondaryAuth, email, password)
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
  logOutSecundario(){
    return signOut(this.secondaryAuth)
  }

  async getCurrentUser(): Promise<User | null>{
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

  verificarUsuario() : Observable<any>{
    return new Observable((observer) =>{
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          observer.next(user);
          console.log('Usuario logeado:', user);
          console.log('UID: ' + user.uid)
        } else {
          observer.next(null);
        }
        observer.complete();
      });
    })
  }



}
