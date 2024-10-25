import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formGroup : FormGroup

  constructor(
    private formBuilder : FormBuilder,
    private authService : AuthService,
    protected reouter : Router
  ){
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(30)]],
      password : ['', [Validators.required, Validators.minLength(6)]]
    })

  }

}
