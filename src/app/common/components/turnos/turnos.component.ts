import { Component, ViewChild } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import Swal from 'sweetalert2';
import { EstadoTurnos } from '../../classes/turno';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Encuesta } from '../../classes/encuesta';


@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [SpinnerComponent, MatDialogModule, MatRadioModule, ReactiveFormsModule, FormsModule],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent {

  protected turnos : any
  protected user : any
  protected userDatabase : any
  formEncuesta: FormGroup
  encuestaOpen = false
  protected turnoSeleccionado : any
  turnosFiltrados: any[] = [];
  filtro: string = '';


  constructor(private databaseService : DatabaseService, 
    private authService : AuthService,
    private fb: FormBuilder,
  ){
    this.formEncuesta = this.fb.group({
      calidadAtencion: ['', Validators.required],
      tiempoEspera: ['', Validators.required],
      tratoMedico: ['', Validators.required],
      comentario: ['']
    });
  }

  ngOnInit(){
    this.authService.verificarUsuario().subscribe((user) => {
      this.user = user
      this.databaseService.obtenerUserPorID('usuarios', user.uid).subscribe((userDatabase : any) => {
        const us = userDatabase.data()
        this.userDatabase = us
        this.databaseService.getTurnos(user.uid, us.tipoUsuario).subscribe((turnos) => {
          this.turnos = turnos
          this.turnosFiltrados = turnos
      })
      })
    })
  }

  openEncuesta(turno: any): void {
    this.turnoSeleccionado = turno
    const encuesta = document.getElementById('encuesta') as HTMLDialogElement
    encuesta.showModal()
  }

  closeEncuesta(): void {
    const encuesta = document.getElementById('encuesta') as HTMLDialogElement
    encuesta.close()
  }

  mostrarEvaluacion(turno : any){
    Swal.fire(turno.evaluacion)
  }


  cancelarTurno(turno : any){
    Swal.fire({
      title: `Desea cancelar el turno del<br>${turno.fecha} a las ${turno.hora}`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: "Cancelar turno",
      cancelButtonText: `Salir`,
      cancelButtonColor: 'red'
    }).then((result) => {   
      if (result.isConfirmed) {
        this.databaseService.modificarTurno(turno.id, EstadoTurnos.Cancelado)
        Swal.fire(`Turno cancelado!`, "", "success");
      } 
    });
    
  }

  async finalizarTurno(turno : any){
    const { value: evaluacion } = await Swal.fire({
      title: "Cargue la evaluación del paciente",
      input: "text",
      inputLabel: "Evaluación del paciente",
      inputPlaceholder: "Escriba la evaluación aquí...",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Necesita escribir la evaluación";
        }
        return undefined
      }
    });
    
    if (evaluacion) {
      this.databaseService.finalizarTurno(turno.id, EstadoTurnos.Finalizado, evaluacion)
      Swal.fire(`Turno finalizado!`);
    }
  }




  rechazarTurno(turno : any){
    Swal.fire({
      title: `Desea finalizar el turno del paciente ${turno.nombrePaciente} el<br>${turno.fecha} a las ${turno.hora}`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: "Rechazar turno",
      cancelButtonText: `Salir`,
      cancelButtonColor: 'red'
    }).then((result) => {   
      if (result.isConfirmed) {
        this.databaseService.modificarTurno(turno.id, EstadoTurnos.Rechazado)
        Swal.fire(`Turno rechazado!`, "", "success");
      } 
    });
  }

  aceptarTurno(turno : any){
    this.databaseService.modificarTurno(turno.id, EstadoTurnos.Aceptado)
    Swal.fire(`Turno aceptado!`, "", "success");
  }



  enviarEncuesta(){
    if (this.formEncuesta.valid) {
      const encuestaData = this.formEncuesta.value;
      console.log("Datos de la encuesta:", encuestaData);
      const encuesta = new Encuesta(this.turnoSeleccionado.medicoId, 
        this.turnoSeleccionado.nombreEspecialista, 
        this.turnoSeleccionado.idPaciente, 
        this.turnoSeleccionado.nombrePaciente, 
        this.turnoSeleccionado.id, 
        encuestaData.calidadAtencion, 
        encuestaData.comentario, 
        encuestaData.tiempoEspera, 
        encuestaData.tratoMedico
      )
      this.databaseService.agregar(encuesta, 'encuestas')
      this.databaseService.modificarEncuestaTurno(this.turnoSeleccionado.id, true)
      Swal.fire("Encuesta enviada", "", "success")
      this.closeEncuesta();  
    } else {
      console.log("Formulario no válido"); 
    }
  }


  filtrarTurnos(){
    const filtroEnMinusculas = this.filtro.toLowerCase()

    if(this.userDatabase.tipoUsuario === 'paciente'){
      this.turnosFiltrados = this.turnos.filter((turno : any) => {
        const especialidadEnMinusculas = turno.especialidad.toLowerCase();
        const nombreEspecialistaEnMinusculas = turno.nombreEspecialista.toLowerCase();
  
  
        return (
          especialidadEnMinusculas.includes(filtroEnMinusculas) ||
          nombreEspecialistaEnMinusculas.includes(filtroEnMinusculas)
        );
      });

    }else if(this.userDatabase.tipoUsuario === 'especialista'){
      this.turnosFiltrados = this.turnos.filter((turno : any) => {
        const especialidadEnMinusculas = turno.especialidad.toLowerCase();
        const nombrePacienteEnMinusculas = turno.nombrePaciente.toLowerCase();
  
  
        return (
          especialidadEnMinusculas.includes(filtroEnMinusculas) ||
          nombrePacienteEnMinusculas.includes(filtroEnMinusculas)
        );
      });

    }else if(this.userDatabase.tipoUsuario === 'administrador'){
      this.turnosFiltrados = this.turnos.filter((turno : any) => {
        const especialidadEnMinusculas = turno.especialidad.toLowerCase();
        const nombrePacienteEnMinusculas = turno.nombrePaciente.toLowerCase();
        const nombreEspecialistaEnMinusculas = turno.nombreEspecialista.toLowerCase();
  
        return (
          especialidadEnMinusculas.includes(filtroEnMinusculas) ||
          nombrePacienteEnMinusculas.includes(filtroEnMinusculas) ||
          nombreEspecialistaEnMinusculas.includes(filtroEnMinusculas)
        );
      });

    }
  }



}
