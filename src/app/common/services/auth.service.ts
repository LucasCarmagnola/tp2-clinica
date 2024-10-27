import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth : Auth) { }

  registro(email : string, password : string){
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  login(email : string, password : string){
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  logOut(){
    return signOut(this.auth)
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }


}
