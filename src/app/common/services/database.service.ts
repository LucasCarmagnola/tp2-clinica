import { Injectable } from '@angular/core';
import { Especialista, Usuario } from '../classes/usuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { Turno } from '../classes/turno';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  userAuth : any
  userDatabase : any

  constructor(private firestore: AngularFirestore, private authService : AuthService, private storageService : StorageService, private auth : Auth) {
    const user = this.authService.user
    if(user){
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          this.userAuth = user
          this.obtenerUserPorID('usuarios', user.uid).subscribe((userDatabase : any) => {
            const user = userDatabase.data()
            this.userDatabase = user
          })
    
        } else {
          console.log('No hay usuario logeado');
          this.userDatabase = null
        }
      });
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

  traerEspecialistas(){
    const colUsuarios = this.firestore.collection('usuarios', ref => ref.where('tipoUsuario', '==','especialista'))
    return colUsuarios.valueChanges()
  }

  traerEspecialista(especialidad : string){
    const colUsuarios = this.firestore.collection('usuarios', ref => ref
      .where('tipoUsuario', '==','especialista')
      .where('especialidades', 'array-contains', especialidad)
    )
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

  agregarEspecialidad(nombreEspecialidad: string, imagen : Blob){
    const coleccion = this.firestore.collection('especialidades')
    const documento = coleccion.doc()
    const url = this.storageService.subirImagenEspecialidad(imagen, nombreEspecialidad)
    documento.set({nombre: nombreEspecialidad, foto: url})
  }

  getTurnosOcupados(medicoId: string, startDate: string, endDate: string) {
    return this.firestore.collection('turnos', ref =>
      ref
        .where('medicoId', '==', medicoId)
        .where('fecha', '>=', startDate)
        .where('fecha', '<=', endDate)
        .where('estado', '==', 'pendiente')
    ).valueChanges();
  }

  sacarTildes(str : string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  crearTurno(hora: string, fecha : string, medico : any, especialidad : string){
    const coleccion = this.firestore.collection('turnos')
    const doc = coleccion.doc()
    const turno = new Turno(fecha, hora, 'pendiente', medico.uid, `${medico.nombre} ${medico.apellido}`, especialidad, this.authService.user.uid, this.authService.user.displayName)

    doc.set({...turno})
  }

  modificarDisponibilidad(uid:string, disponibilidad : any){
    const coleccion = this.firestore.collection('usuarios')
    const doc = coleccion.doc(uid)
    doc.update({
      disponibilidad: disponibilidad
    })
    .then(() => {
      console.log("Disponibilidad actualizada correctamente");
    })
    .catch((error) => {
      console.error("Error al actualizar disponibilidad: ", error);
    });
  }

  getTurnos(uid : any, tipoUsuario : string){
    return this.firestore.collection('turnos', ref => 
      ref
      .where(tipoUsuario === 'paciente' ? 'idPaciente' : 'medicoId', '==', uid)
      .orderBy('fecha', 'asc')
      
    ).valueChanges({ idField: 'id' })
  }

  modificarTurno(idTurno: string, nuevoEstado : string){
    const coleccion = this.firestore.collection('turnos')
    const documento = coleccion.doc(idTurno)
    documento.update({estado : nuevoEstado})
  }

  finalizarTurno(idTurno: string, nuevoEstado : string, evaluacion: string){
    const coleccion = this.firestore.collection('turnos')
    const documento = coleccion.doc(idTurno)
    documento.update({estado : nuevoEstado, evaluacion : evaluacion})
  }




}
