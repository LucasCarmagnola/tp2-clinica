import { Component, Input } from '@angular/core';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-turnos-disponibles',
  standalone: true,
  imports: [],
  templateUrl: './turnos-disponibles.component.html',
  styleUrl: './turnos-disponibles.component.css'
})
export class TurnosDisponiblesComponent {

  protected medicoInput : any = null

  
  //@Input() uidMedico : string = ''
  constructor(private databaseservice : DatabaseService){

  }

  @Input()
  set medicoRecibido(medico : any){
    this.medicoInput = medico
    if(this.medicoInput){
      console.log(`recibiendo el medico papu ${this.medicoInput.uid}`)
      console.log(`turnos disponibles: ${medico.horariosDisponibles}`)
    }
  }

  get medicoRecibido():any {
    return this.medicoInput
  }

  // mostrarTurnosDisponibles(medico : any){
  //   console.log(`turnos disponibles: ${medico.horariosDisponibles}`)
  // }

  seleccionarTurno(){
    
  }

}
