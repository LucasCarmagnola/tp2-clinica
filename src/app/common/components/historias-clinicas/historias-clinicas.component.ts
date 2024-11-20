import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-historias-clinicas',
  standalone: true,
  imports: [],
  templateUrl: './historias-clinicas.component.html',
  styleUrl: './historias-clinicas.component.css'
})
export class HistoriasClinicasComponent {

  turnosFinalizados: any[] = []; 
  pacientes: { idPaciente: string; nombrePaciente: string; fotoPaciente: string }[] = []; 
  turnosPorPaciente: any[] = []; 
  private databaseService = inject(DatabaseService)
  private authService = inject(AuthService)
  private auth = inject(Auth)
  user : any
  mostrarTurnos : boolean = false
  
  async ngOnInit(){
    onAuthStateChanged(this.auth, (user) => {
      if(user){
        this.user = user
        this.databaseService.getTurnos(user.uid, 'especialista').subscribe((turnos:any) =>{
          this.procesarTurnos(turnos)
        })
      }
    })

  }

  procesarTurnos(turnos: any[]) {

    this.turnosFinalizados = turnos.filter(turno => turno.estado === 'finalizado');
  
    const pacientesUnicos = new Map(); 
    this.turnosFinalizados.forEach(turno => {
      if (!pacientesUnicos.has(turno.idPaciente)) {
        pacientesUnicos.set(turno.idPaciente, {
          idPaciente: turno.idPaciente,
          nombrePaciente: turno.nombrePaciente,
          fotoPaciente: turno.fotoPaciente
        });
      }
    });
  
    this.pacientes = Array.from(pacientesUnicos.values());
    console.log('Pacientes únicos:', this.pacientes);
  }

  mostrarTurnosDePaciente(idPaciente: string) {
    this.turnosPorPaciente = this.turnosFinalizados.filter(
      turno => turno.idPaciente === idPaciente
    );
    this.mostrarTurnos = true
    console.log('Turnos del paciente seleccionado:', this.turnosPorPaciente);
  }

  detallesTurno(historiaClinica : any){
    if(historiaClinica.datosDinamicos){}
    const datosDinamicos = historiaClinica.datosDinamicos.map(
      (dato: any) => `<b>${dato.clave}:</b> ${dato.valor}`
    ).join('<br>');
  
    Swal.fire({
      title: `<h2 style="color: #004a7c;">Detalles de la Historia Clínica</h2>`,
      html: `
        <div style="text-align: left; font-size: 16px; color: #333;">
          <p><b>Altura:</b> ${historiaClinica.altura} cm</p>
          <p><b>Peso:</b> ${historiaClinica.peso} kg</p>
          <p><b>Presión:</b> ${historiaClinica.presion}</p>
          <p><b>Temperatura:</b> ${historiaClinica.temperatura} °C</p>
          <p><b>Evaluación:</b> ${historiaClinica.evaluacion}</p>
          <p><b>Datos adicionales:</b></p>
          <p>${datosDinamicos || 'No hay datos adicionales disponibles'}</p>
        </div>
      `,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#004a7c', 
      background: '#f4f8fb', 
      customClass: {
        popup: 'sweetalert-custom', 
      }
    });

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
