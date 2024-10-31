import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Especialista, Paciente, Usuario } from '../../classes/usuario';
import { DatabaseService } from '../../services/database.service';
import { StorageService } from '../../services/storage.service';
import { Auth, onAuthStateChanged, sendEmailVerification } from '@angular/fire/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {

  public formGroup: FormGroup
  public formGroupEspecialistas : FormGroup
  protected tipoUsuario : string = 'paciente'
  imagenPerfil : Blob | null = null
  imagenPortada :  Blob | null = null
  protected user : any = null
  protected emailVerified : boolean = false
  protected form : string = ''


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    protected router : Router,
    private databaseService : DatabaseService,
    private storageService : StorageService,
    private auth : Auth
  ) {
    this.formGroup = this.formBuilder.group({

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
    this.formGroupEspecialistas = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      apellido: ['', [Validators.required, Validators.maxLength(35)]],
      edad: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(2)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(5), Validators.maxLength(10)]],
      especialidad : ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password : ['', [Validators.required, Validators.minLength(6), this.spacesValidator]],
      repeatPassword : ['', [Validators.required, Validators.minLength(6), this.spacesValidator]],
      imagenPerfil: [null, [Validators.required]],
    }, { validators: this.verificarPasswords })
  }

  ngOnInit(){
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.user = user
        this.emailVerified = user.emailVerified
        if(!user.emailVerified){
          this.openModal()
        }else{
          this.router.navigateByUrl('/home')
        }
      } else {
        this.user = null
      }
    });
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

  async registroPaciente(){
    console.log(this.formGroup)
    if(this.formGroup.invalid){
      console.log('FORM INVALIDO')
      return
    }
    try{
      const userCredential = await this.authService.registro(
        this.formGroup.controls['email'].value, 
        this.formGroup.controls['password'].value
      )
      const user = userCredential.user
      this.user = userCredential.user
      const usuario = new Paciente(
        user.uid, this.tipoUsuario, this.formGroup.controls['nombre'].value, 
        this.formGroup.controls['apellido'].value, this.formGroup.controls['edad'].value, 
        this.formGroup.controls['dni'].value, this.formGroup.controls['obraSocial'].value,
        this.formGroup.controls['email'].value
      )
      this.authService.actualizarNombre(usuario.nombre)
      this.databaseService.agregarUsuario(usuario, 'usuarios')
      console.log('Usuario guardado en la base de datos');

      const fotoPerfilSeleccionada = this.formGroup.controls['imagenPerfil'].value
      const fotoPortadaSeleccionada = this.formGroup.controls['imagenPortada'].value
      if(fotoPerfilSeleccionada && this.imagenPerfil){
        this.storageService.subirImagenPerfil(this.imagenPerfil, usuario.uid, 'imagenPerfil')
      }
      if(fotoPortadaSeleccionada && this.imagenPortada){
        this.storageService.subirImagenPortada(this.imagenPortada, usuario.uid, 'imagenPortada')
      }
      await sendEmailVerification(user);
      
      this.openModal()


    }catch(e:any){
      console.error('Error en el registro:', e);
    }
  }

  async registroEspecialista(){
    console.log(this.formGroupEspecialistas)
    if(this.formGroupEspecialistas.invalid){
      console.log('FORM INVALIDO')
      return
    }
    try{
      const userCredential = await this.authService.registro(
        this.formGroupEspecialistas.controls['email'].value, 
        this.formGroupEspecialistas.controls['password'].value
      )
      this.user = userCredential.user
      const especialidades : string[] =  []
      especialidades.push(this.formGroupEspecialistas.controls['especialidad'].value)

      const usuario = new Especialista(this.user.uid, 'especialista', 
        this.formGroupEspecialistas.controls['nombre'].value, this.formGroupEspecialistas.controls['apellido'].value,
        this.formGroupEspecialistas.controls['edad'].value, this.formGroupEspecialistas.controls['dni'].value,
        this.formGroupEspecialistas.controls['email'].value, especialidades
      )
      this.authService.actualizarNombre(usuario.nombre)
      this.databaseService.agregarUsuario(usuario, 'usuarios')
      console.log('Especialista guardado en la base de datos');

      const fotoPerfilSeleccionada = this.formGroupEspecialistas.controls['imagenPerfil'].value
      if(fotoPerfilSeleccionada && this.imagenPerfil){
        this.storageService.subirImagenPerfil(this.imagenPerfil, usuario.uid, 'imagenPerfil')
      }

      await sendEmailVerification(this.user);
      
      this.openModal()

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


  async enviarEmail(){
    this.authService.enviarEmail()
  }


  openModal(){
    Swal.fire({
      title: `Verifique su correo electonico para continuar`,
      text: 'Recuerde revisar su casilla de spam.',
      icon: "info",
      showDenyButton: true,
      confirmButtonText: "Reenviar correo",
      denyButtonText: `Ya lo verifiqué`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.enviarEmail()
      }else if (result.isDenied) {
        this.ngOnInit()
      }
    });
  }


  seleccionForm(opcion : string){
    const seleccion = document.getElementById('seleccion') as HTMLDivElement
    const formPaciente = document.getElementById('form-pacientes') as HTMLDivElement
    const formEspecialista = document.getElementById('form-especialista') as HTMLDivElement
    const backOption = document.getElementById('back-option') as HTMLDivElement

    seleccion.style.display = 'none'
    backOption.style.display = 'flex'
    if(opcion === 'paciente'){
      formPaciente.style.display = 'flex'
    }else if(opcion === 'medico'){
      formEspecialista.style.display = 'flex'
    }
  }

  backSeleccion(){
    const seleccion = document.getElementById('seleccion') as HTMLDivElement
    const formPaciente = document.getElementById('form-pacientes') as HTMLDivElement
    const formEspecialista = document.getElementById('form-especialista') as HTMLDivElement
    const backOption = document.getElementById('back-option') as HTMLButtonElement
    seleccion.style.display = 'flex'
    backOption.style.display = 'none'
    formPaciente.style.display = 'none'
    formEspecialista.style.display = 'none'

  }





}
