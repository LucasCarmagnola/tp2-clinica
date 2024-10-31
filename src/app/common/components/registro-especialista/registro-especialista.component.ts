import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { StorageService } from '../../services/storage.service';
import { Auth, sendEmailVerification } from '@angular/fire/auth';
import { Especialista } from '../../classes/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-especialista',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro-especialista.component.html',
  styleUrl: './registro-especialista.component.css'
})
export class RegistroEspecialistaComponent {

  public formGroupEspecialistas : FormGroup
  protected tipoUsuario : string = 'paciente'
  imagenPerfil : Blob | null = null
  protected user : any = null
  protected emailVerified : boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    protected router : Router,
    private databaseService : DatabaseService,
    private storageService : StorageService,
    private auth : Auth
  ){
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

    }catch(error){

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
        
      }
    });
  }


}
