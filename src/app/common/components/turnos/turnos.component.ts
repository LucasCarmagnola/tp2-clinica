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
import { HighlightDirective } from '../../directives/highlight.directive';


@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [SpinnerComponent, MatDialogModule, MatRadioModule, ReactiveFormsModule, FormsModule, HighlightDirective],
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
  cantidadTurnos : number = 0


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
          this.cantidadTurnos = turnos.length
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

  async cargarEvaluacion(turno : any){
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
      //this.databaseService.finalizarTurno(turno.id, EstadoTurnos.Finalizado, evaluacion)
      //Swal.fire(`Turno finalizado!`);
      this.finalizarTurno(turno, evaluacion)
    }
  }

  async finalizarTurno(turno: any, evaluacion : string) {
    const { value: formValues } = await Swal.fire({
      title: "Cargar Historia Clínica",
      html: `
        <div style="display: flex; flex-direction: column; gap: 15px; max-width: 500px; margin: auto;">
          <label for="altura">Altura (cm):</label>
          <input type="number" id="altura" class="swal2-input" placeholder="Altura (cm)">
          
          <label for="peso">Peso (kg):</label>
          <input type="number" id="peso" class="swal2-input" placeholder="Peso (kg)">
          
          <label for="temperatura">Temperatura (°C):</label>
          <input type="number" id="temperatura" class="swal2-input" placeholder="Temperatura (°C)">
          
          <label for="presion">Presión (ej: 120/80):</label>
          <input type="text" id="presion" class="swal2-input" placeholder="Presión">
  
          <!-- Datos dinámicos -->
          <div style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 15px;">
            <div style="display: flex; width: 100%; justify-content: center; gap: 10px;">
              <input type="text" id="clave1" class="swal2-input" placeholder="Clave 1" style="flex: 1;">
              <input type="text" id="valor1" class="swal2-input" placeholder="Valor 1" style="flex: 1;">
            </div>
            <div style="display: flex; width: 100%; max-width: 400px; justify-content: center; gap: 10px;">
              <input type="text" id="clave2" class="swal2-input" placeholder="Clave 2" style="flex: 1;">
              <input type="text" id="valor2" class="swal2-input" placeholder="Valor 2" style="flex: 1;">
            </div>
            <div style="display: flex; width: 100%; max-width: 400px; justify-content: center; gap: 10px;">
              <input type="text" id="clave3" class="swal2-input" placeholder="Clave 3" style="flex: 1;">
              <input type="text" id="valor3" class="swal2-input" placeholder="Valor 3" style="flex: 1;">
            </div>
          </div>
        </div>
      `,
      focusConfirm: false,
      width: 800, 
      preConfirm: () => {
        const altura = (document.getElementById('altura') as HTMLInputElement).value;
        const peso = (document.getElementById('peso') as HTMLInputElement).value;
        const temperatura = (document.getElementById('temperatura') as HTMLInputElement).value;
        const presion = (document.getElementById('presion') as HTMLInputElement).value;
  
        const clave1 = (document.getElementById('clave1') as HTMLInputElement).value;
        const valor1 = (document.getElementById('valor1') as HTMLInputElement).value;
        const clave2 = (document.getElementById('clave2') as HTMLInputElement).value;
        const valor2 = (document.getElementById('valor2') as HTMLInputElement).value;
        const clave3 = (document.getElementById('clave3') as HTMLInputElement).value;
        const valor3 = (document.getElementById('valor3') as HTMLInputElement).value;
  
        if (!altura || !peso || !temperatura || !presion) {
          Swal.showValidationMessage('Debe completar los datos obligatorios (altura, peso, temperatura, presión).');
          return undefined;
        }
  
        return {
          altura,
          peso,
          temperatura,
          presion,
          datosDinamicos: [
            clave1 && valor1 ? { clave: clave1, valor: valor1 } : null,
            clave2 && valor2 ? { clave: clave2, valor: valor2 } : null,
            clave3 && valor3 ? { clave: clave3, valor: valor3 } : null
          ].filter(dato => dato !== null)
        };
      },
      showCancelButton: true
    });
  
    if (formValues) {
      const historiaClinica = {
        idMedico: turno.medicoId,
        nombreMedico: turno.nombreEspecialista,
        especialidad: turno.especialidad,
        evaluacion: evaluacion,
        altura: parseFloat(formValues.altura),
        peso: parseFloat(formValues.peso),
        temperatura: parseFloat(formValues.temperatura),
        presion: formValues.presion,
        datosDinamicos: formValues.datosDinamicos
      };
      console.log("Valores ingresados:", historiaClinica);
      // this.cargarEvaluacion(turno)
      try{
        await this.databaseService.cargarHistoriaClinica(turno.idPaciente, historiaClinica)
        this.databaseService.agregarHistoriaClinicaATurno(historiaClinica, turno.id)
        this.databaseService.finalizarTurno(turno.id, EstadoTurnos.Finalizado, evaluacion)
        Swal.fire('Historia clínica y evaluacion guardados correctamente', '', 'success');
      }catch(error:any){
        Swal.fire('Error al guardar la historia clínica', error.message, 'error');
      }

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
    console.log(this.filtro)
    const filtroEnMinusculas = this.filtro.toLowerCase()
    console.log(filtroEnMinusculas)
    if(this.userDatabase.tipoUsuario === 'paciente'){
      this.turnosFiltrados = this.turnos.filter((turno : any) => {
        const especialidadEnMinusculas = turno.especialidad.toLowerCase()
        const nombreEspecialistaEnMinusculas = turno.nombreEspecialista.toLowerCase()
        const historiaClinica = turno.historiaClinica || {}
  
  
        return (
          especialidadEnMinusculas.includes(filtroEnMinusculas) ||
          nombreEspecialistaEnMinusculas.includes(filtroEnMinusculas) ||
          this.filtrarPorHistoriaClinica(historiaClinica, filtroEnMinusculas)
        );
      });

    }else if(this.userDatabase.tipoUsuario === 'especialista'){
      this.turnosFiltrados = this.turnos.filter((turno : any) => {
        const especialidadEnMinusculas = (turno.especialidad || '').toLowerCase()
        const nombrePacienteEnMinusculas = (turno.nombrePaciente || '').toLowerCase()
        const historiaClinica = turno.historiaClinica || {}
  
  
        return (
          especialidadEnMinusculas.includes(filtroEnMinusculas) ||
          nombrePacienteEnMinusculas.includes(filtroEnMinusculas) ||
          this.filtrarPorHistoriaClinica(historiaClinica, filtroEnMinusculas)
        );
      });

    }else if(this.userDatabase.tipoUsuario === 'administrador'){
      this.turnosFiltrados = this.turnos.filter((turno : any) => {
        const especialidadEnMinusculas = (turno.especialidad || '').toLowerCase()
        const nombrePacienteEnMinusculas = (turno.nombrePaciente || '').toLowerCase()
        const nombreEspecialistaEnMinusculas = (turno.nombreEspecialista || '').toLowerCase()
        const historiaClinica = turno.historiaClinica || {}
  
        return (
          especialidadEnMinusculas.includes(filtroEnMinusculas) ||
          nombrePacienteEnMinusculas.includes(filtroEnMinusculas) ||
          nombreEspecialistaEnMinusculas.includes(filtroEnMinusculas) ||
          this.filtrarPorHistoriaClinica(historiaClinica, filtroEnMinusculas)
        )
      
      });

    }
  }

  // Método auxiliar para filtrar por los campos de la historia clínica
private filtrarPorHistoriaClinica(historiaClinica: any, filtro: string): boolean {
  const altura = historiaClinica.altura ? historiaClinica.altura.toString() : '';
  const peso = historiaClinica.peso ? historiaClinica.peso.toString() : '';
  const presion = historiaClinica.presion ? historiaClinica.presion.toLowerCase() : '';
  const temperatura = historiaClinica.temperatura ? historiaClinica.temperatura.toString() : '';

  const datosDinamicos = historiaClinica.datosDinamicos || []; 
  const datosDinamicosCoinciden = datosDinamicos.some((dato: { clave: string; valor: string }) => {
    const clave = dato.clave.toLowerCase();
    const valor = dato.valor.toLowerCase();
    return clave.includes(filtro) || valor.includes(filtro);
  });


  return (
    altura.includes(filtro) ||
    peso.includes(filtro) ||
    presion.includes(filtro) ||
    temperatura.includes(filtro) ||
    datosDinamicosCoinciden
  );
}

ordenarTurnosPorEstado(categoriaAEvaluar: string, event: Event): void {

  const selectElement = event.target as HTMLSelectElement;
  const valorDeCategoria = selectElement.value;

  this.turnos.sort((a: any, b: any) => {
    if (a[categoriaAEvaluar] === valorDeCategoria && b[categoriaAEvaluar] !== valorDeCategoria) return -1;
    else if (a[categoriaAEvaluar] !== valorDeCategoria && b[categoriaAEvaluar] === valorDeCategoria) return 1;
    return 0;
  });
}




}

// filtrarTurnos(){
//   const filtroEnMinusculas = this.filtro.toLowerCase()

//   if(this.userDatabase.tipoUsuario === 'paciente'){
//     this.turnosFiltrados = this.turnos.filter((turno : any) => {
//       const especialidadEnMinusculas = turno.especialidad.toLowerCase();
//       const nombreEspecialistaEnMinusculas = turno.nombreEspecialista.toLowerCase();


//       return (
//         especialidadEnMinusculas.includes(filtroEnMinusculas) ||
//         nombreEspecialistaEnMinusculas.includes(filtroEnMinusculas)
//       );
//     });

//   }else if(this.userDatabase.tipoUsuario === 'especialista'){
//     this.turnosFiltrados = this.turnos.filter((turno : any) => {
//       const especialidadEnMinusculas = turno.especialidad.toLowerCase();
//       const nombrePacienteEnMinusculas = turno.nombrePaciente.toLowerCase();


//       return (
//         especialidadEnMinusculas.includes(filtroEnMinusculas) ||
//         nombrePacienteEnMinusculas.includes(filtroEnMinusculas)
//       );
//     });

//   }else if(this.userDatabase.tipoUsuario === 'administrador'){
//     this.turnosFiltrados = this.turnos.filter((turno : any) => {
//       const especialidadEnMinusculas = turno.especialidad.toLowerCase();
//       const nombrePacienteEnMinusculas = turno.nombrePaciente.toLowerCase();
//       const nombreEspecialistaEnMinusculas = turno.nombreEspecialista.toLowerCase();

//       return (
//         especialidadEnMinusculas.includes(filtroEnMinusculas) ||
//         nombrePacienteEnMinusculas.includes(filtroEnMinusculas) ||
//         nombreEspecialistaEnMinusculas.includes(filtroEnMinusculas) 
//       )
//     });

//   }
// }
