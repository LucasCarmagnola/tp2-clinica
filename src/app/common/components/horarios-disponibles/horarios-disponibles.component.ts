import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { DatabaseService } from '../../services/database.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-horarios-disponibles',
  standalone: true,
  imports: [],
  templateUrl: './horarios-disponibles.component.html',
  styleUrl: './horarios-disponibles.component.css'
})
export class HorariosDisponiblesComponent {

  //horariosDisponibles : any
  userDatabase : any
  pacientes : any[] = []

  @Input() horariosDisponibles! : any
  @Input() diaSeleccionado! : any
  @Input() medicoRecibido? : any
  @Input() especialidad? : any


  constructor(private databaseService : DatabaseService, private auth : Auth){

  }

  async ngOnInit(){

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.databaseService.obtenerUserPorID('usuarios', user.uid).subscribe((userDatabase : any) => {
          const user = userDatabase.data()
          this.userDatabase = user
          if(user.tipoUsuario === 'administrador'){
            this.databaseService.traerPacientes().subscribe((pacientes) => {
              this.pacientes = pacientes
            })
          }
        })
  
      } else {
        console.log('No hay usuario logeado');
      }
    })
  }
  

  crearTurno(hora : string){
    console.log(this.diaSeleccionado)
    if (this.userDatabase.tipoUsuario === 'administrador'){
      Swal.fire({
        title: `Desea crear un turno el<br><span style="color: blue;">${this.diaSeleccionado}</span> a las <span style="color: blue;">${hora} hs</span>?`,
        icon: 'info',
        html: `
          <label for="pacienteSelect">Seleccione un paciente al cual se le creara un turno:</label>
          <select id="pacienteSelect" class="swal2-input">
            ${this.pacientes.map(
              (paciente) =>
                `<option value="${paciente.uid}">${paciente.nombre} ${paciente.apellido}</option>`
            ).join('')}
          </select>
        `,
        showDenyButton: true,
        confirmButtonText: "Crear turno",
        denyButtonText: `Cancelar`,
        preConfirm: () => {
          const pacienteId = (document.getElementById('pacienteSelect') as HTMLSelectElement)?.value;
          if (!pacienteId) {
            Swal.showValidationMessage('Debe seleccionar un paciente');
            return null; // Evita cerrar el modal si no se seleccionó un paciente
          }
          return pacienteId; // Retorna solo el ID del paciente
        },
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const pacienteId = result.value;
          const pacienteSeleccionado = this.pacientes.find(p => p.uid === pacienteId); // Busca el objeto paciente completo
          if (pacienteSeleccionado) {
            this.databaseService.crearTurno(hora, this.diaSeleccionado, this.medicoRecibido, this.especialidad, pacienteSeleccionado);
            Swal.fire("Turno creado con éxito!", "Podrá revisar los detalles en \"mis turnos\"", "success");
          } else {
            Swal.fire("Error", "No se encontró el paciente seleccionado.", "error");
          }
        }
      });
    }else{
      Swal.fire({
        title: `Desea crear un turno el<br><span style="color: blue;">${this.diaSeleccionado}</span> a las <span style="color: blue;">${hora} hs</span>?`,
        icon : 'info',
        showDenyButton: true,
        confirmButtonText: "Crear turno",
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.databaseService.crearTurno(hora, this.diaSeleccionado, this.medicoRecibido, this.especialidad)
          console.log(this.especialidad)
          Swal.fire("Turno creado con éxito!", "Podrá revisar los detalles en \"mis turnos\"", "success");
        } 
        });
      }
    }

}
