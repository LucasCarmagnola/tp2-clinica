import { CurrencyPipe, DatePipe, JsonPipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MuyLargoPipe } from './common/pipes/muy-largo.pipe';
import { HighlightDirective } from './common/directives/highlight.directive';

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
}
