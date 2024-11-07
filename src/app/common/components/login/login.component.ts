import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { NgxCaptchaModule } from 'ngx-captcha';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgxCaptchaModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formGroup : FormGroup
  user : any = null
  returnUrl : string = '/'
  protected siteKey : string = '6Ldd73cqAAAAAE2Is1HfygGUwGLmba4WtvmTRiiJ'

  constructor(
    private formBuilder : FormBuilder,
    private authService : AuthService,
    protected router : Router,
    private databaseservice : DatabaseService,
    private route : ActivatedRoute
  ){
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];

    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password : ['', [Validators.required, Validators.minLength(6)]]
    })

  }



  async login(){
    if(this.formGroup.invalid){
      console.log('FORM INVALIDO')
      return
    }
    try{
      const email = this.formGroup.controls['email'].value;
      const password = this.formGroup.controls['password'].value;
      const userCredential: any = await this.authService.login(email, password)
      this.user = userCredential.user;
      if (!this.user.emailVerified) {
        this.mostrarAlertEmailNoVerificado()
        return;
      }

      const userSnapshot = await this.databaseservice.obtenerUserPorID('usuarios', this.user.uid).toPromise();
      const usuarioBD : any = userSnapshot?.data();
      if(usuarioBD && usuarioBD.tipoUsuario === 'paciente'){
        this.router.navigateByUrl(this.returnUrl)
      }else if (usuarioBD.tipoUsuario === 'especialista' || usuarioBD.tipoUsuario === 'administrador') {
        if (usuarioBD.isActive) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          Swal.fire({title : "Su cuenta aún no ha sido activada",
            icon : 'info'
            });
        }
      }

    }catch(error : any){
      console.log('error.code: ', error)
      switch (error.code) {
        case 'auth/user-not-found':
          Swal.fire('No se encontró un usuario con este correo.');
          break;
        case 'auth/wrong-password':
          Swal.fire('La contraseña es incorrecta.');
          break;
        case 'auth/invalid-email':
          Swal.fire('El correo ingresado no es válido.');
          break;
        case 'auth/invalid-credential':
          Swal.fire('Credenciales invalidas');
          break;
        default:
          Swal.fire('Ocurrió un error al iniciar sesión.');
          break;
      }
    }
  }

  private mostrarAlertEmailNoVerificado() {
    Swal.fire({
      title: "Su correo aún no ha sido verificado",
      text: "Recuerde verificar su casilla de spam",
      showDenyButton: true,
      confirmButtonText: "Reenviar correo",
      denyButtonColor: "#74dc74",
      denyButtonText: `Ok`
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.enviarEmail();
      }
    });
  }

  resetPassword(email : string){
    Swal.fire({
      title: `¿Quiere enviar un correo de recuperacion a: ${this.formGroup.controls['email'].value}?`,
      icon: "info",
      showDenyButton: true,
      confirmButtonText: "Enviar correo",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.reestablecerPassword(email)
        Swal.fire('El correo fue enviado!')
      }else if (result.isDenied) {

      }
    });
  }


  cargarPerfil(perfil:number){
    switch(perfil){
      case 1:
        this.formGroup.patchValue({
          email: 'admin@somelora.com',
          password: '123456'  
        });
        break
      case 2:
        this.formGroup.patchValue({
          email: 'fy5t0h3day@qejjyl.com',
          password: '123456'  
        });
        break
      case 3:
        this.formGroup.patchValue({
          email: 'especialista2@ibolinva.com',
          password: '123456'  
        });
        break
      case 4:
        this.formGroup.patchValue({
          email: 'paciente1@ibolinva.com',
          password: '123456'  
        });
        break
      case 5:
        this.formGroup.patchValue({
          email: 'paciente2@ibolinva.com',
          password: '123456'  
        });
        break
      case 6:
        this.formGroup.patchValue({
          email: 'paciente3@ibolinva.com',
          password: '123456'  
        });
        break
    
    }
  }

  handleReset(){

  }

  handleExpire(){

  }

  handleLoad(){

  }

  handleSuccess($event : string){

  }

  

}
