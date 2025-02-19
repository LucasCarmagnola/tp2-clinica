import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TurnosDisponiblesComponent } from '../turnos-disponibles/turnos-disponibles.component';
import { HorariosDisponiblesComponent } from "../horarios-disponibles/horarios-disponibles.component";
import { animate, state, style, transition, trigger } from '@angular/animations';



@Component({
  selector: 'app-conseguir-turno',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TurnosDisponiblesComponent, HorariosDisponiblesComponent],
  templateUrl: './conseguir-turno.component.html',
  styleUrl: './conseguir-turno.component.css',
  animations: [
    trigger('slideInFromTop', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }), // Inicia fuera de la pantalla y con opacidad 0
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ), // Aparece con opacidad 1 y en su posición original
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }), // Estado inicial cuando se va a salir
        animate(
          '300ms ease-in',
          style({ transform: 'translateY(-100%)', opacity: 0 })
        ), // Se mueve hacia arriba y pierde opacidad
      ]),
    ]),
  ],
})
export class ConseguirTurnoComponent {

  horariosDisponibles : any
  diaSeleccinoado : string = ''
  user : any
  userDatabase : any
  medicoSeleccionado : any 
  especialidadSeleccionada : string = ''
  especialistasDisponibles : any = null
  especialidadesMedicas: any[] = [
    { nombre: 'Cardiologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
    { nombre: 'Dermatologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
    { nombre: 'Endocrinologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
    { nombre: 'Gastroenterologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
    { nombre: 'Ginecologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
    { nombre: 'Medico clinico', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
    { nombre: 'Neumologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
    { nombre: 'Neurologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
    { nombre: 'Oftalmologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
    { nombre: 'Oncologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
    { nombre: 'Ortopedia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
    { nombre: 'Pediatria', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
    { nombre: 'Psiquiatria', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
    { nombre: 'Traumatologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
    { nombre: 'Urologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' }
  ];


  constructor(private authService : AuthService, private databaseService : DatabaseService, private fb : FormBuilder){
    // this.formulario = this.fb.group({
    //   medico: ['', [Validators.required]]
    // })
  }
  

  async ngOnInit(){
    this.user = await this.authService.user
    this.userDatabase = await this.databaseService.userDatabase
  }

  recibirDato(dato : any){
    this.horariosDisponibles = dato
  }
  recibirDia(dato : string){
    this.diaSeleccinoado = dato
  }

  verMedicosDisponibles(especialidad : any){
    this.medicoSeleccionado = ''
    this.diaSeleccinoado = ''
    this.especialidadSeleccionada = ''
    this.horariosDisponibles = ''
    this.especialidadSeleccionada = especialidad.nombre
    const back = document.getElementById('volver') as HTMLDivElement
    const turnos = document.getElementById('solicitar-turno') as HTMLDivElement
    const listaMedicos = document.getElementById('container-lista-especialistas') as HTMLDivElement
    const turnosComponent = document.getElementById('turnos-component') as HTMLDivElement
    const horariosComponent = document.getElementById('horarios-component') as HTMLDivElement
    if(back){back.style.display = 'block'}
    if(turnos){turnos.style.display = 'none'}
    if(listaMedicos){listaMedicos.style.display = 'flex'}
    if(turnosComponent){turnosComponent.style.display = 'grid'}
    if(horariosComponent){horariosComponent.style.display = 'grid'}

    this.databaseService.traerEspecialista(especialidad.nombre.toLowerCase()).subscribe((values) => {
      this.especialistasDisponibles = values
    })
    console.log(this.especialistasDisponibles)
  }


  backEspecialidades(){
    const back = document.getElementById('volver') as HTMLDivElement
    const turnos = document.getElementById('solicitar-turno') as HTMLDivElement
    const listaMedicos = document.getElementById('container-lista-especialistas') as HTMLDivElement
    const turnosComponent = document.getElementById('turnos-component') as HTMLDivElement
    const horariosComponent = document.getElementById('horarios-component') as HTMLDivElement

    if(back){back.style.display = 'none'}
    if(turnos){turnos.style.display = 'flex'}
    if(listaMedicos){listaMedicos.style.display = 'none'}
    if(turnosComponent){turnosComponent.style.display = 'none'}
    if(horariosComponent){horariosComponent.style.display = 'none'}
    this.medicoSeleccionado = null
    this.diaSeleccinoado = ''
    this.especialidadSeleccionada = ''
    this.horariosDisponibles = ''
  }


  scrollLeft() {
    const container = document.querySelector('.container-especialidades');
    if(container){
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }
  
  scrollRight() {
    const container = document.querySelector('.container-especialidades');
    if(container){
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }
  


}
