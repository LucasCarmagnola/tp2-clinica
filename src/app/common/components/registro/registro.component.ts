import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {

  public formGroup: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    protected router : Router
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

  registro(){
    console.log(this.formGroup)
    if(this.formGroup.invalid){
      console.log('FORM INVALIDO')
    }else{
      console.log('FORM VALIDO')
    }
  }





}
