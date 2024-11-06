import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { StorageService } from '../../services/storage.service';
import { Auth, sendEmailVerification } from '@angular/fire/auth';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Administrador, Especialista, Paciente } from '../../classes/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-admin',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro-admin.component.html',
  styleUrl: './registro-admin.component.css'
})
export class RegistroAdminComponent {

  imagenPerfil : Blob | null = null
  imagenPortada :  Blob | null = null
  public grupoPacientes: FormGroup
  public grupoEspecialistas : FormGroup
  public grupoAdmins : FormGroup
  especialidadesMedicas: string[] = [
    'Cardiologia',
    'Dermatologia',
    'Endocrinologia',
    'Gastroenterologia',
    'Ginecologia',
    'Medico clinico',
    'Neumologia',
    'Neurologia',
    'Oftalmologia',
    'Oncologia',
    'Ortopedia',
    'Pediatria',
    'Psiquiatria',
    'Traumatologia',
    'Urologia'
  ];
  obrasSociales: string[] = [
    'PARTICULAR',
    'GALENO',
    'IOMA',
    'MEDIFE',
    'OSDE',
    'PODER JUDICIAL',
    'SANCOR SALUD',
    'SWISS MEDICAL',
    'UNION PERSONAL',
    'OSDEPYM',
    'OSPJN',
    'PAMI'
];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    protected router : Router,
    private databaseService : DatabaseService,
    private storageService : StorageService,
    private auth : Auth
  ){
    this.grupoPacientes = this.formBuilder.group({

      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      apellido: ['', [Validators.required, Validators.maxLength(25)]],
      edad: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(2)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(5), Validators.maxLength(10)]],
      obraSocial : ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password : ['', [Validators.required, Validators.minLength(6), this.spacesValidator]],
      repeatPassword : ['', [Validators.required, Validators.minLength(6), this.spacesValidator]],
      imagenPerfil: [null],
      imagenPortada: [null]
    }, { validators: this.verificarPasswords })
    this.grupoEspecialistas = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      apellido: ['', [Validators.required, Validators.maxLength(35)]],
      edad: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(2)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(5), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password : ['', [Validators.required, Validators.minLength(6), this.spacesValidator]],
      repeatPassword : ['', [Validators.required, Validators.minLength(6), this.spacesValidator]],
      imagenPerfil: [null, [Validators.required]],
      especialidades: [[], [Validators.required]]
    }, { validators: this.verificarPasswords })
    this.grupoAdmins = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      apellido: ['', [Validators.required, Validators.maxLength(35)]],
      edad: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(2)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(5), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password : ['', [Validators.required, Validators.minLength(6), this.spacesValidator]],
      repeatPassword : ['', [Validators.required, Validators.minLength(6), this.spacesValidator]],
      imagenPerfil: [null, [Validators.required]],
    }, { validators: this.verificarPasswords })
  }


  async registroPaciente(){
    console.log(this.grupoPacientes)
    if(this.grupoPacientes.invalid){
      console.log('FORM INVALIDO')
      return
    }
    try{
      const userCredential = await this.authService.registroSecundario(
        this.grupoPacientes.controls['email'].value, 
        this.grupoPacientes.controls['password'].value
      )
      const user = userCredential.user
      const usuario = new Paciente(
        user.uid, 'paciente', this.grupoPacientes.controls['nombre'].value, 
        this.grupoPacientes.controls['apellido'].value, this.grupoPacientes.controls['edad'].value, 
        this.grupoPacientes.controls['dni'].value, this.grupoPacientes.controls['obraSocial'].value,
        this.grupoPacientes.controls['email'].value
      )
      this.authService.actualizarNombre(usuario.nombre)
      this.databaseService.agregarUsuario(usuario, 'usuarios')
      console.log('Usuario guardado en la base de datos');

      const fotoPerfilSeleccionada = this.grupoPacientes.controls['imagenPerfil'].value
      const fotoPortadaSeleccionada = this.grupoPacientes.controls['imagenPortada'].value
      if(fotoPerfilSeleccionada && this.imagenPerfil){
        this.storageService.subirImagenPerfil(this.imagenPerfil, usuario.uid, 'imagenPerfil')
      }
      if(fotoPortadaSeleccionada && this.imagenPortada){
        this.storageService.subirImagenPortada(this.imagenPortada, usuario.uid, 'imagenPortada')
      }
      await sendEmailVerification(user);

      this.authService.logOutSecundario()
      this.openModal('El paciente se ha registrado con exito!', 'Se envio un correo a su direccion para que verifique su cuenta')

    }catch(e:any){
      console.error('Error en el registro:', e);
    }
  }


  async registroEspecialista(){
    console.log(this.grupoEspecialistas)
    if(this.grupoEspecialistas.invalid){
      console.log('FORM INVALIDO')
      return
    }
    try{
      const userCredential = await this.authService.registroSecundario(
        this.grupoEspecialistas.controls['email'].value, 
        this.grupoEspecialistas.controls['password'].value
      )
      const user = userCredential.user
  
      const usuario = new Especialista(user.uid, 'especialista', 
        this.grupoEspecialistas.controls['nombre'].value, this.grupoEspecialistas.controls['apellido'].value,
        this.grupoEspecialistas.controls['edad'].value, this.grupoEspecialistas.controls['dni'].value,
        this.grupoEspecialistas.controls['email'].value, this.grupoEspecialistas.controls['especialidades'].value
      )
      this.authService.actualizarNombre(usuario.nombre)
      this.databaseService.agregarUsuario(usuario, 'usuarios')
      console.log('Especialista guardado en la base de datos');

      const fotoPerfilSeleccionada = this.grupoEspecialistas.controls['imagenPerfil'].value
      if(fotoPerfilSeleccionada && this.imagenPerfil){
        this.storageService.subirImagenPerfil(this.imagenPerfil, usuario.uid, 'imagenPerfil')
      }

      await sendEmailVerification(user);
      
      this.authService.logOutSecundario()
      this.openModal('El Especialista se ha registrado con exito!', 'Se envio un correo a su direccion para que verifique su cuenta')

    }catch(e){
      console.error('Error en el registro:', e);
    }

  
  }

  async registroAdministrador(){
    console.log(this.grupoAdmins)
    if(this.grupoAdmins.invalid){
      console.log('FORM INVALIDO')
      return
    }
    try{
      const userCredential = await this.authService.registroSecundario(
        this.grupoAdmins.controls['email'].value, 
        this.grupoAdmins.controls['password'].value
      )
      const user = userCredential.user
  
      const usuario = new Administrador(user.uid,
        this.grupoAdmins.controls['nombre'].value, this.grupoAdmins.controls['apellido'].value,
        this.grupoAdmins.controls['edad'].value, this.grupoAdmins.controls['dni'].value,
        this.grupoAdmins.controls['email'].value, 
      )
      this.authService.actualizarNombre(usuario.nombre)
      this.databaseService.agregarUsuario(usuario, 'usuarios')
      console.log('Administrador guardado en la base de datos');

      const fotoPerfilSeleccionada = this.grupoAdmins.controls['imagenPerfil'].value
      if(fotoPerfilSeleccionada && this.imagenPerfil){
        this.storageService.subirImagenPerfil(this.imagenPerfil, usuario.uid, 'imagenPerfil')
      }

      await sendEmailVerification(user);
      
      this.authService.logOutSecundario()
      this.openModal('El Administrador se ha registrado con exito!', 'Se envio un correo a su direccion para que verifique su cuenta')

    }catch(e){
      console.error('Error en el registro:', e);
    }

  
  }

  ImagenPerfilCargada($event : any){
    const file = $event.target.files[0];
    const imagen = new Blob([file], {
      type: file.type,
    });
    if (imagen) {
     this.imagenPerfil = imagen 
    } else {
      this.imagenPerfil = null 
    }
  }

  ImagenPortadaCargada($event : any){
    const file = $event.target.files[0];
    const imagen = new Blob([file], {
      type: file.type,
    });
    if (imagen) {
     this.imagenPortada = imagen 
    } else {
      this.imagenPortada = null 
    }
  }


  spacesValidator(control: AbstractControl): null | object {
    const valor: string = <string>control.value;
    const tieneEspacios = valor.includes(' ');

    if (tieneEspacios) {
      return {
        espacios: {
          posicion: valor.indexOf(' '),
        }
      }
    }
    return null;
  }

  verificarPasswords(control: AbstractControl): null | object {
    const password : string = control.get('password')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;
    if(password === repeatPassword){
      return null
    }else{
      return { passwordMismatch: true }
    }
  }

  openModal(titulo: string, texto: string){
    Swal.fire({
      title: `${titulo}`,
      text: `${texto}`,
      icon: 'success',
    })

  }







  
}
