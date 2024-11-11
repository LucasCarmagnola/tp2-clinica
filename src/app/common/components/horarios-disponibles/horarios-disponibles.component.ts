import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-horarios-disponibles',
  standalone: true,
  imports: [],
  templateUrl: './horarios-disponibles.component.html',
  styleUrl: './horarios-disponibles.component.css'
})
export class HorariosDisponiblesComponent {

  //horariosDisponibles : any

  @Input() horariosDisponibles! : any
  @Input() diaSeleccionado! : any
  @Input() medicoRecibido? : any
  @Input() especialidad? : any


  constructor(private databaseService : DatabaseService){

  }
  

  crearTurno(hora : string){
    console.log(this.diaSeleccionado)
    Swal.fire({
      title: `Desea crear un turno el<br><span style="color: blue;">${this.diaSeleccionado}</span> a las <span style="color: blue;">${hora} hs</span>?`,
      icon : 'info',
      showDenyButton: true,
      confirmButtonText: "Crear turno",
      denyButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        this.databaseService.crearTurno(hora, this.diaSeleccionado, this.medicoRecibido, this.especialidad)
        console.log(this.especialidad)
        Swal.fire("Turno creado con éxito!", "Podrá revisar los detalles en \"mis turnos\"", "success");
      } 
    });
  }

}
