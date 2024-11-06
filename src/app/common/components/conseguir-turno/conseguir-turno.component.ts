import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-conseguir-turno',
  standalone: true,
  imports: [],
  templateUrl: './conseguir-turno.component.html',
  styleUrl: './conseguir-turno.component.css'
})
export class ConseguirTurnoComponent {

  user : any
  userDatabase : any
  especialidadesMedicas: string[] = [
    'Cardiologia',
    'Dermatologia',
    'Endocrinologia',
    'Gastroenterologia',
    'Ginecologia',
    'Medico clinico',
    'Neumologia',
    'Neurologia',
    'Oftalmologia',
    'Oncologia',
    'Ortopedia',
    'Pediatria',
    'Psiquiatria',
    'Traumatologia',
    'Urologia'
  ];

  constructor(private authService : AuthService, private databaseService : DatabaseService){
    
  }

  async ngOnInit(){
    this.user = await this.authService.user
    this.userDatabase = await this.databaseService.userDatabase
    console.log('en el componente conseguir turno')
  }

}
