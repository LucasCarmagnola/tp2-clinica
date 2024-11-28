import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {

  turnos : any[] = []
  turnosPorEspecialidad: any
  user : any
  especialistas : any[] = []
  registros : any[] = []
  turnosDelEspecialista : any[] = []
  turnosPorMes : any[] = []
  meses : any
  turnosPorEspecialista : any[] = []
  turnosFinalizadosPorEspecialistaPorMes : any[] = []
  // especialidadesMedicas: any[] = [
  //   { nombre: 'Cardiologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
  //   { nombre: 'Dermatologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
  //   { nombre: 'Endocrinologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
  //   { nombre: 'Gastroenterologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
  //   { nombre: 'Ginecologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
  //   { nombre: 'Medico clinico', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
  //   { nombre: 'Neumologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
  //   { nombre: 'Neurologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
  //   { nombre: 'Oftalmologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
  //   { nombre: 'Oncologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
  //   { nombre: 'Ortopedia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
  //   { nombre: 'Pediatria', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
  //   { nombre: 'Psiquiatria', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
  //   { nombre: 'Traumatologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' },
  //   { nombre: 'Urologia', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8zedzO3aVEiL09oNMIFz5GYsSJDB84GLxxA&s' }
  // ];
  especialidadesMedicas = [
    'Cardiologia',
    'Dermatologia',
    'Endocrinologia',
    'Gastroenterologia',
    'Ginecologia',
    'Medico clinico',
    'Neumologia',
    'Neurologia',
    'Oftalmologia',
    'Oncologia',
    'Ortopedia',
    'Pediatria',
    'Psiquiatria',
    'Traumatologia',
    'Urologia'
  ]


  constructor(private databaseService : DatabaseService, private authService : AuthService){

  }

  ngOnInit(){
    this.authService.verificarUsuario().subscribe((user) => {
      this.user = user
      this.databaseService.getTurnos(user.uid, 'administrador').subscribe((turnos) => {
        this.turnos = turnos
        this.turnosPorEspecialidad = this.agruparTurnosPorEspecialidad(turnos);
        console.log(this.turnosPorEspecialidad)
        
        this.databaseService.traerEspecialistas().subscribe(especialistas => {
          this.especialistas = especialistas
          console.log(especialistas)
          this.agruparTurnosPorEspecialista(especialistas, turnos)
          this.turnosPorMes = this.agruparTurnosPorMes(turnos)
          this.meses = Object.keys(this.turnosPorMes)
          this.turnosPorEspecialista = this.agruparPorEspecialista(this.turnosPorMes);
          this.turnosFinalizadosPorEspecialistaPorMes = this.filtrarTurnosFinalizados(this.turnosPorEspecialista);

        })
      })
    })

    this.databaseService.traerRegistros().subscribe((logs)=>{
      this.registros = logs
    })

  }

  agruparTurnosPorEspecialidad(turnos : any[]){
    return turnos.reduce((resultado: { [key: string]: any[] }, turno) => {
      const especialidad = turno.especialidad;
      if (!resultado[especialidad]) {
        resultado[especialidad] = [];
      }
      resultado[especialidad].push(turno);
      return resultado;
    }, {});
  }

  agruparTurnosPorEspecialista(especialistas : any[], turnos : any[]){
    especialistas.forEach((especialista) => {
      const turnosDeEspecialista = turnos.filter(turno => turno.medicoId === especialista.uid)

      this.turnosDelEspecialista[especialista.uid] = turnosDeEspecialista
    })
    console.log(this.turnosDelEspecialista)
  }


  agruparTurnosPorMes(turnos: any[]){
    return turnos.reduce((acumulador, turno) => {
      const fecha = new Date(turno.fecha);
      const mesClave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`; // yyyy-mm
  
      // Si no existe la clave del mes, la creamos
      if (!acumulador[mesClave]) {
        acumulador[mesClave] = [];
      }
  
      // Agregamos el turno al mes correspondiente
      acumulador[mesClave].push(turno);
      return acumulador;
    }, {}); // El objeto acumulador comienza vacío
  };

  agruparPorEspecialista(turnosPorMes: any) {
    const result : any = {};
    Object.keys(turnosPorMes).forEach( mes => {
      result[mes] = {};
      turnosPorMes[mes].forEach((turno : any) => {
        // Si el especialista ya existe, se agrega el turno a su lista
        if (!result[mes][turno.nombreEspecialista]) {
          result[mes][turno.nombreEspecialista] = [];
        }
        result[mes][turno.nombreEspecialista].push(turno);
      });
    });
    return result;
  }

  getMeses(): string[] {
    // Devuelve las claves de los meses
    return Object.keys(this.turnosPorEspecialista);
  }
  
  getEspecialistasPorMes(mes: any): any[] {
    // Devuelve las claves (nombres de especialistas) y sus turnos para un mes dado
    const especialistas = this.turnosPorEspecialista[mes];
    return Object.entries(especialistas).map(([key, value]) => ({
      nombre: key,
      turnos: (value as any[]).length,
    }));
  }


  filtrarTurnosFinalizados(turnosPorEspecialistaPorMes: any) {
    const result: any = {};
    
    Object.keys(turnosPorEspecialistaPorMes).forEach((mes) => {
      result[mes] = {};
  
      Object.keys(turnosPorEspecialistaPorMes[mes]).forEach((especialista) => {
        const turnos = turnosPorEspecialistaPorMes[mes][especialista];
        // Filtrar los turnos con estado 'finalizado'
        const turnosFinalizados = turnos.filter((turno: any) => turno.estado === 'finalizado');
  
        if (turnosFinalizados.length > 0) {
          result[mes][especialista] = turnosFinalizados;
        }
      });
    });
  
    return result;
  }
  


  getEspecialistasFinalizadosPorMes(mes: any): any[] {
    const especialistas = this.turnosFinalizadosPorEspecialistaPorMes[mes];
    return Object.entries(especialistas).map(([key, value]) => ({
      nombre: key,
      turnosFinalizados: (value as any[]).length,
    }));
  }

}
