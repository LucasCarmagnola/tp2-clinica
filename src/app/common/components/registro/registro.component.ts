import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../classes/usuario';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {

  public formGroup: FormGroup
  protected tipoUsuario : string = 'paciente'

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    protected router : Router,
    private databaseService : DatabaseService
  ) {
    this.formGroup = this.formBuilder.group({

      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      apellido: ['', [Validators.required, Validators.maxLength(25)]],
      edad: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(2)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(5), Validators.maxLength(10)]],
      obraSocial : ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(30)]],
      password : ['', [Validators.required, Validators.minLength(6), this.spacesValidator]],
      repeatPassword : ['', [Validators.required, Validators.minLength(6), this.spacesValidator]],
      especialidad: ['', [Validators.required]],
      imagenPerfil: ['', [Validators.required]]
    }, { validators: this.verificarPasswords })
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

  async registro(){
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
      const usuario = new Usuario(
        userCredential.user.uid, this.tipoUsuario, this.formGroup.controls['nombre'].value, 
        this.formGroup.controls['apellido'].value, this.formGroup.controls['edad'].value, 
        this.formGroup.controls['dni'].value, this.formGroup.controls['obraSocial'].value,
        this.formGroup.controls['obraSocial'].value,
      )
      this.databaseService.agregarUsuario(usuario)
      this.router.navigateByUrl('/home')

    }catch(e:any){
      console.error('Error en el registro:', e);
      console.log(e.message)
    }
  }





}
