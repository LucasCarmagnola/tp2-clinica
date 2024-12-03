import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos-disponibles',
  standalone: true,
  imports: [],
  templateUrl: './turnos-disponibles.component.html',
  styleUrl: './turnos-disponibles.component.css'
})
export class TurnosDisponiblesComponent {

  protected medicoInput : any = null
  turnosDisponibles : any

  
  @Output() horariosEmitidos : EventEmitter<string> = new EventEmitter<string>()
  @Output() diaSeleccionadoEmitido : EventEmitter<string> = new EventEmitter<string>()

  constructor(private databaseservice : DatabaseService){

  }

  @Input()
  set medicoRecibido(medico : any){
    this.medicoInput = medico
    if(this.medicoInput){
      this.generarTurnosDisponibles(this.medicoInput.uid)
    }else{
      this.turnosDisponibles = null
    }
  }

  get medicoRecibido():any {
    return this.medicoInput
  }

  // mostrarTurnosDisponibles(medico : any){
  //   console.log(`turnos disponibles: ${medico.horariosDisponibles}`)
  // }

  enviarHorarios(dato : any){
    if(this.medicoRecibido){
      console.log('encviando datos:', dato)
      this.horariosEmitidos.emit(dato)
    }else{
      Swal.fire('Seleccione un especialista')
    }
  }
  
  enviarDia(dia : string){
    console.log('enviando dia:', dia)
    this.diaSeleccionadoEmitido.emit(dia)
    
  }


  async generarTurnosDisponibles(medicoId: string) {
    console.log('se esta ejecutando el metodo')
    const startDate = new Date();
    const endDate = new Date();
    
    endDate.setDate(startDate.getDate() + 14);
    const fechaInicio =  this.formatDate(startDate)
    const fechaFin =  this.formatDate(endDate)
    
    const disponibilidad = this.medicoInput.disponibilidad;
    
    const turnosDisponibles : any = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const diaSemana = d.toLocaleDateString('es-ES', { weekday: 'long' });
      const diaSemanaSinTildes = this.databaseservice.sacarTildes(diaSemana);
      try{
        const horarioDia = disponibilidad[diaSemanaSinTildes];

        if (horarioDia) {
          const horariosDia = this.crearHorarios(horarioDia.inicio, horarioDia.fin);
          const formattedDate = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
          turnosDisponibles.push({ dia: formattedDate, horarios: horariosDia });
          console.log(formattedDate)
        }
      }catch(e){
        console.log(e)
      }
    }

    this.databaseservice.getTurnosOcupados(medicoId, fechaInicio, fechaFin).subscribe((turnos: any[]) => {
      turnos.forEach((turno: any) => {
        // Encuentra el día correspondiente en turnosDisponibles
        const dia = turnosDisponibles.find((d: any) => d.dia === turno.fecha);

        if (dia) {
          // Si el día existe, busca el horario correspondiente
          const horario = dia.horarios.find((h: any) => h.hora === turno.hora);
          if (horario) {
            horario.disponible = false; // Marca como no disponible
            console.log(`Horario ocupado: ${turno.hora} en la fecha ${turno.fecha}`);
          }
        }
      });
    });

    this.turnosDisponibles = turnosDisponibles;
  }


  crearHorarios(inicio: string, fin: string): Array<{ hora: string, disponible: boolean }> {
    const horarios = [];
    let inicioFormateado = inicio.split(':'); // Separamos la hora y los minutos
    if (inicioFormateado[0].length === 1) {
      // Si la hora tiene un solo dígito, lo completamos con un 0
      inicioFormateado[0] = '0' + inicioFormateado[0];
    }

    // Ahora volvemos a juntar la hora y los minutos
    let inicioFinal = inicioFormateado.join(':');
    let horaActual = new Date(`1990-01-01T${inicioFinal}:00`);
    const horaFin = new Date(`1990-01-01T${fin}:00`);
  
    while (horaActual < horaFin) {
      const horaStr = horaActual.toTimeString().slice(0, 5); // Ejemplo: "08:00"
      horarios.push({ hora: horaStr, disponible: true });
      
      // Incrementa en 30 minutos
      horaActual.setMinutes(horaActual.getMinutes() + 30);
    }
  
    return horarios;
  }


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Asegura que el mes siempre tenga dos dígitos
    const day = date.getDate().toString().padStart(2, '0'); // Asegura que el día siempre tenga dos dígitos

    return `${year}-${month}-${day}`;
  }



}
