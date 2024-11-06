import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  user : any = null
  userDatabase : any = null


  constructor(private authService : AuthService, private auth : Auth, private databaseService : DatabaseService){
    //this.user = this.authService.user
  }

  async ngOnInit(){
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.user = user
        console.log('Usuario logeado:', user);
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

}
