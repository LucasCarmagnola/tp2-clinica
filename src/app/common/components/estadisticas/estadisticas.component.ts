import { Component, ChangeDetectorRef } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import ApexCharts from "apexcharts";


@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {

  turnos : any
  turnosPorEspecialidad: any
  user : any
  especialistas : any[] = []
  registros : any[] = []
  turnosDelEspecialista : any[] = []
  turnosPorMes : any[] = []
  meses : any
  turnosPorEspecialista : any[] = []
  turnosFinalizadosPorEspecialistaPorMes : any[] = []
  chartTurnosPorEspecialidad : any
  graficoTurnosPorEspecialidad : boolean = false
  graficoTurnosPorDia : boolean = false
  graficoTurnosPorEspecialistaPorMes : boolean = false
  graficoTurnosFinalizadosPorEspecialistaPorMes : boolean = false
  mostrarTabla : boolean = false
  
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


  constructor(private databaseService : DatabaseService, private authService : AuthService, private cdr: ChangeDetectorRef){

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

          //this.inicializarGraficoTurnosPorEspecialidad()
          //this.inicializarGraficoTurnosPorDia()
          //this.inicializarGraficoTurnosPorEspecialistaPorMes()
          //this.inicializarGraficoTurnosFinalizadosPorEspecialistaPorMes()

        })
      })
    })

    this.databaseService.traerRegistros().subscribe((logs)=>{
      this.registros = logs
    })

  }

  agruparTurnosPorDia(turnos: any[]) {
    return turnos.reduce((resultado, turno) => {
      const fecha = turno.fecha.split(' ')[0]; // Extrae la fecha (yyyy-mm-dd)
      if (!resultado[fecha]) {
        resultado[fecha] = [];
      }
      resultado[fecha].push(turno);
      return resultado;
    }, {});
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


  private inicializarGraficoTurnosPorEspecialidad() {
    const especialidades = Object.keys(this.turnosPorEspecialidad);
    const cantidades = especialidades.map(especialidad => this.turnosPorEspecialidad[especialidad].length);
  
    const options = {
      series: [
        {
          name: 'Cantidad de Turnos',
          data: cantidades,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      xaxis: {
        categories: especialidades,
        title: { text: 'Especialidades' },
      },
      yaxis: {
        title: { text: 'Cantidad de Turnos' },
      },
      title: {
        text: 'Cantidad de Turnos por Especialidad',
        align: 'center',
      },
    };

    const chart = new ApexCharts(document.querySelector('#chart-turnos-por-especialidad'), options);
    chart.render();
  }

  prepararDatosParaGrafico(turnos: any[]) {
    const turnosPorDia = this.agruparTurnosPorDia(turnos);
    const fechas = Object.keys(turnosPorDia); // Las fechas
    const cantidadTurnos = fechas.map(fecha => turnosPorDia[fecha].length); // Cantidad de turnos por cada fecha
  
    return { fechas, cantidadTurnos };
  }


  inicializarGraficoTurnosPorDia() {
  
    const { fechas, cantidadTurnos } = this.prepararDatosParaGrafico(this.turnos);

    const options = {
     chart: {
        type: 'bar',
        height: 350
      },
      series: [
        {
          name: 'Turnos',
          data: cantidadTurnos // Datos de la cantidad de turnos por día
        }
      ],
      xaxis: {
        categories: fechas // Las fechas para el eje X
      },
      title: {
        text: 'Cantidad de Turnos por dia',
        align: 'center',
      },
    };

    const chart = new ApexCharts(document.querySelector('#chart-turnos-por-dia'), options);
    chart.render();
  }

  inicializarGraficoTurnosPorEspecialistaPorMes() {
    const meses = this.getMeses();  // Obtener los meses
    
    // Obtener todos los especialistas únicos que aparecen en cualquier mes
    const especialistas = Array.from(
      new Set(meses.flatMap((mes:any) => Object.keys(this.turnosPorEspecialista[mes])))
    );
  
    // Crear las series de datos para cada especialista
    const seriesData = especialistas.map(especialista => {
      return meses.map(mes => {
        // Buscar la cantidad de turnos de ese especialista en el mes
        const turnos = this.getEspecialistasPorMes(mes).find(item => item.nombre === especialista);
        return turnos ? turnos.turnos : 0;  // Si no tiene turnos, devuelve 0
      });
    });
  
    // Definir las opciones del gráfico
    const options = {
      series: seriesData.map((data, index) => ({
        name: especialistas[index],  // Nombre del especialista
        data: data,  // Los datos (cantidad de turnos por mes)
      })),
      chart: {
        height: 350,
        type: 'bar',
        stacked: false,  // No apilado, para barras separadas
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: meses,  // Los meses como categorías del eje X
      },
      yaxis: {
        title: {
          text: 'Cantidad de Turnos',
        },
      },
      legend: {
        position: 'top',
      },
      title: {
        text: 'Cantidad de Turnos por Especialista por Mes',
        align: 'center',
      },
    };
  
    // Crear y renderizar el gráfico
    const chart = new ApexCharts(document.querySelector('#chart-turnos-por-especialista-por-mes'), options);
    chart.render();
  }

  inicializarGraficoTurnosFinalizadosPorEspecialistaPorMes() {
    const meses = this.getMeses();  
    
    // Obtener todos los especialistas únicos que aparecen en cualquier mes
    const especialistas = Array.from(
      new Set(meses.flatMap((mes:any) => Object.keys(this.turnosFinalizadosPorEspecialistaPorMes[mes])))
    );
  
    // Crear las series de datos para cada especialista con los turnos finalizados
    const seriesData = especialistas.map(especialista => {
      return meses.map(mes => {
        // Buscar la cantidad de turnos finalizados de ese especialista en el mes
        const turnos = this.getEspecialistasFinalizadosPorMes(mes).find(item => item.nombre === especialista);
        return turnos ? turnos.turnosFinalizados : 0;  // Si no tiene turnos, devuelve 0
      });
    });
  
    // Definir las opciones del gráfico
    const options = {
      series: seriesData.map((data, index) => ({
        name: especialistas[index],  // Nombre del especialista
        data: data,  // Los datos (cantidad de turnos finalizados por mes)
      })),
      chart: {
        height: 350,
        type: 'bar',
        stacked: false,  // No apilado, para barras separadas
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: meses,  // Los meses como categorías del eje X
      },
      yaxis: {
        title: {
          text: 'Cantidad de Turnos Finalizados',
        },
      },
      legend: {
        position: 'top',
      },
      title: {
        text: 'Cantidad de Turnos Finalizados por Especialista por Mes',
        align: 'center',
      },
    };
  
    // Crear y renderizar el gráfico
    const chart = new ApexCharts(document.querySelector('#chart-turnos-finalizados-por-especialista-por-mes'), options);
    chart.render();
  }

  mostrarGrafico(grafico : number){
    if(grafico === 1){
      const texto = document.getElementById('texto-turnos-por-especialidad') as HTMLElement;
      this.graficoTurnosPorEspecialidad = !this.graficoTurnosPorEspecialidad
      if (texto) {
        texto.style.borderRadius = '10px';
      }
      if(this.graficoTurnosPorEspecialidad === true){
        this.cdr.detectChanges()
        this.inicializarGraficoTurnosPorEspecialidad()
        if (texto) {
          texto.style.borderRadius = '10px 10px 0 0';
        }
      }
    }else if(grafico === 2){
      const texto = document.getElementById('texto-turnos-por-dias') as HTMLElement;
      this.graficoTurnosPorDia = !this.graficoTurnosPorDia
      if (texto) {
        texto.style.borderRadius = '10px';
      }
      if(this.graficoTurnosPorDia === true){
        this.cdr.detectChanges()
        this.inicializarGraficoTurnosPorDia()
        if (texto) {
          texto.style.borderRadius = '10px 10px 0 0';
        }
      }
    }else if(grafico === 3){
      const texto = document.getElementById('texto-turnos-por-especialista-mes') as HTMLElement;
      this.graficoTurnosPorEspecialistaPorMes = !this.graficoTurnosPorEspecialistaPorMes
      if (texto) {
        texto.style.borderRadius = '10px';
      }
      if(this.graficoTurnosPorEspecialistaPorMes === true){
        this.cdr.detectChanges()
        this.inicializarGraficoTurnosPorEspecialistaPorMes()
        if (texto) {
          texto.style.borderRadius = '10px 10px 0 0';
        }
      }
    }else if(grafico === 4){
      const texto = document.getElementById('texto-turnos-finalizados-por-especialista') as HTMLElement;
      this.graficoTurnosFinalizadosPorEspecialistaPorMes = !this.graficoTurnosFinalizadosPorEspecialistaPorMes
      if (texto) {
        texto.style.borderRadius = '10px';
      }
      if(this.graficoTurnosFinalizadosPorEspecialistaPorMes === true){
        this.cdr.detectChanges()
        this.inicializarGraficoTurnosFinalizadosPorEspecialistaPorMes()
        if (texto) {
          texto.style.borderRadius = '10px 10px 0 0';
        }
      }
    }else if(grafico === 0){
      const texto = document.getElementById('texto-tabla') as HTMLElement;
      this.mostrarTabla = !this.mostrarTabla
      if (texto) {
        texto.style.borderRadius = '10px';
      }
      if(this.mostrarTabla){
        if (texto) {
          texto.style.borderRadius = '10px 10px 0 0';
        }
        
      }
    }



  }
  





}
