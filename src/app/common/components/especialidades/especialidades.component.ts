import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.css'
})
export class EspecialidadesComponent implements OnInit {

  especialidades : any[] = []
  nombre : any 
  foto : Blob | null = null


  constructor(private databaseService : DatabaseService){}

  ngOnInit(): void {
      this.databaseService.getEspecialidades().subscribe((especialidades) => {
        this.especialidades = especialidades
      })
  }


  agregarEspecialidad(){
    Swal.fire({
      title: `Desea agregar la especialidad \"${this.nombre}\"?`,
      showDenyButton: true,
      confirmButtonText: "Agregar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if(this.foto && this.nombre){
          this.databaseService.agregarEspecialidad(this.nombre.toLowerCase(), this.foto)
          Swal.fire("Especialidad guardada!", "", "success");
        }else{
          Swal.fire("Seleccione una foto y un nombre para poder agregar la especialidad", "", "info");
        }
      }
    });
  }


  imagenCargada($event : any){
    const file = $event.target.files[0];
    const imagen = new Blob([file], {
      type: file.type,
    });
    if (imagen) {
     this.foto = imagen 
    } else {
      this.foto = null 
    }
  }

}
