import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formGroup : FormGroup
  user : any = null

  constructor(
    private formBuilder : FormBuilder,
    private authService : AuthService,
    protected router : Router,
    private databaseservice : DatabaseService
  ){
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password : ['', [Validators.required, Validators.minLength(6)]]
    })

  }


  // async login(){
  //   this.authService.login(this.formGroup.controls['email'].value, 
  //     this.formGroup.controls['password'].value).then(async (user : any) =>{
  //       this.user = await user
  //       this.databaseservice.obtenerUserPorID('usuarios', user.uid).subscribe((userDatabase : any) => {
  //         const usuarioBD = userDatabase.data()
  //         if(this.user.emailVerified){
  //           if(usuarioBD.tipoUsuario === 'paciente'){
  //             this.router.navigateByUrl('/home')
  //             return
  //           }
  //           if(usuarioBD.tipoUsuario === 'especialista' && usuarioBD.isActive){
  //             this.router.navigateByUrl('/home')
  //             return
  //           }else{
  //             Swal.fire("Su cuenta aún no ha sido activada");
  //           }
  //         }else{
  //           Swal.fire({
  //             title: "Su correo aun no ha sido verificado",
  //             text: "Recuerde verificar su casilla de spam",
  //             showDenyButton: true,
  //             confirmButtonText: "Reenviar correo",
  //             denyButtonColor: "#74dc74",
  //             denyButtonText: `Ok`
  //           }).then((result) => {
  //             if (result.isConfirmed) {
  //               this.authService.enviarEmail()
  //             }
  //           });
  //         }
  //       })
  //     })

  // }

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
        this.router.navigateByUrl('/home')
      }else if (usuarioBD.tipoUsuario === 'especialista') {
        if (usuarioBD.isActive) {
          this.router.navigateByUrl('/home');
        } else {
          Swal.fire("Su cuenta aún no ha sido activada");
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

  

}
