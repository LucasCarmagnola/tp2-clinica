import { Component, ViewChild } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import Swal from 'sweetalert2';
import { EstadoTurnos } from '../../classes/turno';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [SpinnerComponent, MatDialogModule, MatRadioModule, ReactiveFormsModule],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent {

  protected turnos : any
  protected user : any
  protected userDatabase : any
  formEncuesta: FormGroup
  encuestaOpen = false


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
      })
      })
    })
  }

  openEncuesta(turno: any): void {
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



  enviarEncuesta(){
    if (this.formEncuesta.valid) {
      const encuestaData = this.formEncuesta.value;
      console.log("Datos de la encuesta:", encuestaData);
      this.closeEncuesta();  
    } else {
      console.log("Formulario no válido"); //aca tengo que poder obtener los datos del turno, asi saco el id del medico y el id del turno
    }
  }



}
