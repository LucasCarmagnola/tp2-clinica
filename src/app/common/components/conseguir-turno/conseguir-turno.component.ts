import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TurnosDisponiblesComponent } from '../turnos-disponibles/turnos-disponibles.component';

@Component({
  selector: 'app-conseguir-turno',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TurnosDisponiblesComponent],
  templateUrl: './conseguir-turno.component.html',
  styleUrl: './conseguir-turno.component.css'
})
export class ConseguirTurnoComponent {

  user : any
  userDatabase : any
  medicoSeleccionado : any 
  especialidadSeleccionada : string = ''
  especialistasDisponibles : any[] = []
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

  constructor(private authService : AuthService, private databaseService : DatabaseService, private fb : FormBuilder){
    // this.formulario = this.fb.group({
    //   medico: ['', [Validators.required]]
    // })
  }

  async ngOnInit(){
    this.user = await this.authService.user
    this.userDatabase = await this.databaseService.userDatabase
    console.log('en el componente conseguir turno')
  }

  verMedicosDisponibles(){
    const back = document.getElementById('volver') as HTMLDivElement
    const turnos = document.getElementById('solicitar-turno') as HTMLDivElement
    const listaMedicos = document.getElementById('lista-especialistas') as HTMLDivElement
    const turnosComponent = document.getElementById('turnos-component') as HTMLDivElement
    if(back){back.style.display = 'block'}
    if(turnos){turnos.style.display = 'none'}
    if(listaMedicos){listaMedicos.style.display = 'flex'}
    if(turnosComponent){turnosComponent.style.display = 'flex'}

    this.databaseService.traerEspecialista(this.especialidadSeleccionada.toLowerCase()).subscribe((values) => {
      this.especialistasDisponibles = values
    })
    console.log(this.especialistasDisponibles)
  }


  backEspecialidades(){
    const back = document.getElementById('volver') as HTMLDivElement
    const turnos = document.getElementById('solicitar-turno') as HTMLDivElement
    const listaMedicos = document.getElementById('lista-especialistas') as HTMLDivElement
    const turnosComponent = document.getElementById('turnos-component') as HTMLDivElement

    if(back){back.style.display = 'none'}
    if(turnos){turnos.style.display = 'flex'}
    if(listaMedicos){listaMedicos.style.display = 'none'}
    if(turnosComponent){turnosComponent.style.display = 'none'}
  }


}
