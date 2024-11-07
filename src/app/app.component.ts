import { CurrencyPipe, DatePipe, JsonPipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MuyLargoPipe } from './common/pipes/muy-largo.pipe';
import { HighlightDirective } from './common/directives/highlight.directive';
import { AuthService } from './common/services/auth.service';
import { DatabaseService } from './common/services/database.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TitleCasePipe, CurrencyPipe, JsonPipe, DatePipe, MuyLargoPipe, HighlightDirective, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  user : any = null
  userDatabase : any = null
  showHeader = true;

  constructor(private authService : AuthService, 
    protected router : Router, private databaseService : DatabaseService,
    private auth : Auth){
      this.router.events.subscribe(() => {
        this.showHeader = !['/login', '/registro', '/login?returnUrl=%2Fhome','/login?returnUrl=%2Fconseguir-turno', '/login?returnUrl=%2Fmis-turnos'].includes(this.router.url);
      });
  }

  async ngOnInit(){
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.user = user
        this.databaseService.obtenerUserPorID('usuarios', user.uid).subscribe((userDatabase : any) => {
          const user = userDatabase.data()
          this.userDatabase = user
          console.log(user.tipoUsuario)
        })
  
      } else {
        console.log('No hay usuario logeado');
        this.user = null
      }
    });
  }

  salir(){
    this.authService.logOut()
    this.router.navigateByUrl('/login')
  }
}
