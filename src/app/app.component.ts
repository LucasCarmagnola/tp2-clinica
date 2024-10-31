import { CurrencyPipe, DatePipe, JsonPipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MuyLargoPipe } from './common/pipes/muy-largo.pipe';
import { HighlightDirective } from './common/directives/highlight.directive';
import { AuthService } from './common/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TitleCasePipe, CurrencyPipe, JsonPipe, DatePipe, MuyLargoPipe, HighlightDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tp-2 PIPES';
  precio = 10000
  fecha = new Date()
  objeto = {
    nombre: 'Lucas',
    apellido : 'Carmagnola',
    edad : 22
  }

  constructor(private authService : AuthService, protected router : Router){

  }

  salir(){
    this.authService.logOut()
    this.router.navigateByUrl('/home')
  }
}
