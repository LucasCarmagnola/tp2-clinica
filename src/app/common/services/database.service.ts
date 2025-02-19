import { Injectable } from '@angular/core';
import { Especialista, Usuario } from '../classes/usuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { Turno } from '../classes/turno';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { from, map, switchMap, take } from 'rxjs';
import { ref } from '@angular/fire/storage';

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

  agregar(objeto : any, coleccion : string, id : string | null = null){
    const col = this.firestore.collection(coleccion)

    if (id) {
      const documento = col.doc(id);
      documento.set({ ...objeto });
    } else {
        col.add({ ...objeto });
    }
  }

  traerUsuarios(){
    const colUsuarios = this.firestore.collection('usuarios', ref => ref.orderBy('tipoUsuario', 'asc'))
    return colUsuarios.valueChanges()
  }
  // traerUsuariosConHistoriasClinicas() {
    
  //   this.traerUsuarios().forEach((usuario:any) => {
  //     this.firestore.collection(`usuarios/${usuario.uid}/historiasClinicas`).valueChanges()
  //   })
    
  // }
  traerUsuariosConHistoriasClinicas() {
    // Obtener usuarios
    return this.firestore.collection('usuarios').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data: any = a.payload.doc.data(); // Datos del usuario
        const id = a.payload.doc.id; // ID del documento
        return { id, ...data }; // Combinar ID con los datos del usuario
      })),
      switchMap(usuarios => {
        // Para cada usuario, agregar sus historias clínicas
        const usuariosConHistoriasClinicas = usuarios.map(async usuario => {
          const historiasClinicas = await this.firestore
            .collection(`usuarios/${usuario.id}/historiasClinicas`)
            .valueChanges()
            .pipe(take(1)) // Tomar una única vez los datos
            .toPromise(); // Convertir observable a promesa
  
          // Devolver el usuario con sus historias clínicas
          return { ...usuario, historiasClinicas: historiasClinicas || [] };
        });
  
        // Esperar a que todas las promesas se resuelvan
        return from(Promise.all(usuariosConHistoriasClinicas));
      })
    );
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
  traerPacientes(){
    const colUsuarios = this.firestore.collection('usuarios', ref => ref
      .where('tipoUsuario', '==','paciente')
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

  async agregarEspecialidad(nombreEspecialidad: string, imagen : Blob){
    const coleccion = this.firestore.collection('especialidades')
    const documento = coleccion.doc()
    const url = await this.storageService.subirImagenEspecialidad(imagen, nombreEspecialidad)
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

  crearTurno(hora: string, fecha : string, medico : any, especialidad : string, paciente : any = null){
    try{
      const coleccion = this.firestore.collection('turnos')
      const doc = coleccion.doc()
      if(paciente === null){
        const turno = new Turno(fecha, hora, 'pendiente', medico.uid, `${medico.nombre} ${medico.apellido}`, especialidad, this.authService.user.uid, this.authService.user.displayName, this.authService.user.photoURL)
        doc.set({...turno})
      }else{
        const turno = new Turno(fecha, hora, 'pendiente', medico.uid, `${medico.nombre} ${medico.apellido}`, especialidad, paciente.uid, paciente.nombre + paciente.apellido, paciente.imagenPerfil)
        doc.set({...turno})
      }
  

    }catch(error){
      throw error
    }
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
    if(tipoUsuario === 'paciente' || tipoUsuario === 'especialista'){
      return this.firestore.collection('turnos', ref => 
        ref
        .where(tipoUsuario === 'paciente' ? 'idPaciente' : 'medicoId', '==', uid)
        .orderBy('fecha', 'asc')
        
      ).valueChanges({ idField: 'id' })
    }else{
      return this.firestore.collection('turnos', ref => 
        ref.orderBy('fecha', 'asc')
      ).valueChanges({ idField: 'id' })
    }
  }

  modificarTurno(idTurno: string, nuevoEstado : string){
    const coleccion = this.firestore.collection('turnos')
    const documento = coleccion.doc(idTurno)
    documento.update({estado : nuevoEstado})
  }

  modificarEncuestaTurno(idTurno: string, nuevoEstado : boolean){
    const coleccion = this.firestore.collection('turnos')
    const documento = coleccion.doc(idTurno)
    documento.update({encuestaCompletada : nuevoEstado})
  }

  finalizarTurno(idTurno: string, nuevoEstado : string, evaluacion: string){
    const coleccion = this.firestore.collection('turnos')
    const documento = coleccion.doc(idTurno)
    documento.update({estado : nuevoEstado, evaluacion : evaluacion})
  }

  agregarHistoriaClinicaATurno(historiaClinica:any, idTurno:string){
    const coleccion = this.firestore.collection('turnos')
    const documento = coleccion.doc(idTurno)
    documento.update({historiaClinica : historiaClinica})
  }


  async cargarHistoriaClinica(idUsuario: string, historiaClinica: any){
    try {
      const historiasClinicasRef = this.firestore
        .collection('usuarios') // Colección de usuarios
        .doc(idUsuario) // Documento del usuario correspondiente
        .collection('historiasClinicas'); // Subcolección de historias clínicas
  
      // Agregar un nuevo documento a la colección
      const nuevaHistoria = await historiasClinicasRef.add({
        ...historiaClinica,
        fecha: new Date().toISOString() // Se guarda la fecha actual como timestamp
      });
  
      console.log(`Historia clínica cargada con ID: ${nuevaHistoria.id}`);
      return nuevaHistoria.id; // Devuelve el ID del nuevo documento creado
    } catch (error) {
      console.error('Error al cargar la historia clínica:', error);
      throw error;
    }
  }

  traerHistoriasClinicas(idDocumento : string){
    return this.firestore.collection(`usuarios/${idDocumento}/historiasClinicas`).valueChanges()
  }

  async traerHistoriasClinicasEspecialista(especialista:any){
    try{
      this.firestore.collection('turnos', ref => ref.where('idMedico', '==', especialista.id))
      .valueChanges().subscribe((turnos:any)=> {
        if(turnos){
          const idPacientes = [
            ...new Set(turnos.docs.map((doc:any) => doc.data().idPaciente))
          ];
        }
      })
  
      
    }catch(error){

    }
  }


  traerRegistros(){
    return this.firestore.collection('registros', ref => 
      ref.orderBy('fecha', 'asc')
    ).valueChanges()
  }

  getEspecialidades(){
    return this.firestore.collection('especialidades').valueChanges()
  }


}
