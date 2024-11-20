import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-horarios',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SpinnerComponent],
  templateUrl: './mis-horarios.component.html',
  styleUrl: './mis-horarios.component.css'
})
export class MisHorariosComponent {

  protected user : any
  protected userDB : any
  private authService = inject(AuthService)
  private databaseService = inject(DatabaseService)
  private auth = inject(Auth)
  private fb = inject(FormBuilder)
  formulario : FormGroup
  protected formVisible = false
  historiasClinicas : any[] = []
  especialidadesEnHistoriasClinicas : string[] = []
  historiasClinicasPorEspecialidad : any

  constructor(){
    //   this.formulario = this.fb.group({
    //   dias: ['', [Validators.required]],
    //   horario: ['', [Validators.required]]
    // })
    this.formulario = this.fb.group({
      lunes: new FormControl(false),
      martes: new FormControl(false),
      miercoles: new FormControl(false),
      jueves: new FormControl(false),
      viernes: new FormControl(false),
      sabado: new FormControl(false),
      // Agregar los controles de inicio y fin para cada día
      lunes_inicio: new FormControl(''),
      lunes_fin: new FormControl(''),
      martes_inicio: new FormControl(''),
      martes_fin: new FormControl(''),
      miercoles_inicio: new FormControl(''),
      miercoles_fin: new FormControl(''),
      jueves_inicio: new FormControl(''),
      jueves_fin: new FormControl(''),
      viernes_inicio: new FormControl(''),
      viernes_fin: new FormControl(''),
      sabado_inicio: new FormControl(''),
      sabado_fin: new FormControl('')
    });
  }

  ngOnInit(){
    onAuthStateChanged(this.auth, (user) => {
      this.toggleAllTimeInputs(false);
      if (user) {
        this.user = user
        this.databaseService.obtenerUserPorID('usuarios', user.uid).subscribe((userDatabase : any) => {
          const user = userDatabase.data()
          this.userDB = user
          console.log('a ver el user')
          console.log(this.userDB)
        })
        this.databaseService.traerHistoriasClinicas(user.uid).subscribe(historiasClinicas => {
          this.historiasClinicas = historiasClinicas
          console.log(historiasClinicas)

          this.especialidadesEnHistoriasClinicas = [
            ...new Set(historiasClinicas.map((historia : any) => historia.especialidad))
          ];

          this.historiasClinicasPorEspecialidad = this.especialidadesEnHistoriasClinicas.reduce((acc:any, especialidad:any) => {
            acc[especialidad] = historiasClinicas.filter((historia:any) => historia.especialidad === especialidad);
            return acc;
          }, {});

          console.log(this.especialidadesEnHistoriasClinicas);
          console.log(this.historiasClinicasPorEspecialidad);

        })
  
      } else {
        console.log('No hay usuario logeado');
        this.user = null
      }
    })

    
  }

  toggleTimeInputs(day: string): void {
    const daySelected = this.formulario.get(day)?.value;

    // Activa o desactiva los controles de inicio y fin según si el checkbox está marcado o no
    this.formulario.get(`${day}_inicio`)?.[daySelected ? 'enable' : 'disable']();
    this.formulario.get(`${day}_fin`)?.[daySelected ? 'enable' : 'disable']();
  }

  toggleAllTimeInputs(enable: boolean): void {
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    days.forEach(day => {
      this.formulario.get(`${day}_inicio`)?.[enable ? 'enable' : 'disable']();
      this.formulario.get(`${day}_fin`)?.[enable ? 'enable' : 'disable']();
    });
  }

  setFullSchedule(day: string): void {
    // Definir horarios predeterminados
    const weekdayHours = { inicio: '08:00', fin: '19:00' };
    const saturdayHours = { inicio: '08:00', fin: '14:00' };

    // Seleccionar el horario según el día
    const hours = day === 'sabado' ? saturdayHours : weekdayHours;

    // Asignar los horarios a los controles de inicio y fin
    this.formulario.get(`${day}_inicio`)?.setValue(hours.inicio);
    this.formulario.get(`${day}_fin`)?.setValue(hours.fin);
  }

  cargarDisponibilidad(): void {
    const disponibilidad: { [key: string]: { inicio: string, fin: string } } = {};
  
    // Recorremos cada día y agregamos solo los días seleccionados con sus horarios
    ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'].forEach(day => {
      if (this.formulario.get(day)?.value) { // Verifica si el día está seleccionado
        disponibilidad[day] = {
          inicio: this.formulario.get(`${day}_inicio`)?.value,
          fin: this.formulario.get(`${day}_fin`)?.value
        };
      }
    });
  
    console.log("Disponibilidad cargada:", disponibilidad);
    this.databaseService.modificarDisponibilidad(this.user.uid, disponibilidad)

    Swal.fire('Disponibilidad cargada!')
    this.formVisible = false
    this.ngOnInit()
  }

  mostrarHorarios(){
    this.formVisible = true
  }

  cerrarFormulario(){
    this.formVisible = false
  }


  detallesTurno(historiaClinica : any){
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
      confirmButtonColor: '#004a7c', // Azul similar al de la página
      background: '#f4f8fb', // Fondo claro
      customClass: {
        popup: 'sweetalert-custom', // Estilo adicional si necesitas CSS personalizado
      }
    });

  }

}
