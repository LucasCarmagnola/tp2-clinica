import { Injectable } from '@angular/core';
import { Usuario } from '../classes/usuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) { }

  agregarUsuario(usuario : Usuario){
    const colUsuarios = this.firestore.collection('usuarios')
    const documento = colUsuarios.doc(usuario.uid)

    documento.set(usuario)
    console.log('Estoy En el service. Agregando usuario a la base de datos.')
  }
}
