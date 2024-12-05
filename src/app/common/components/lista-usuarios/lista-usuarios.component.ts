import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { MuyLargoPipe } from '../../pipes/muy-largo.pipe';
import { DniPuntosPipe } from '../../pipes/dni-puntos.pipe';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerComponent, CommonModule, MuyLargoPipe, DniPuntosPipe],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent {

  protected usuarios : any[] = []
  protected emailVerified : any
  formulario : FormGroup
  tablaHistoriaClinica : boolean = false
  usuarioSeleccionado : any

  constructor(private databaseService : DatabaseService, private authService : AuthService, private fb : FormBuilder){
    this.formulario = this.fb.group({
      dias: ['', [Validators.required]],
      horario: ['', [Validators.required]]
    })
  }

  async ngOnInit(){
    this.emailVerified = this.authService.emailVerified
    this.databaseService.traerUsuariosConHistoriasClinicas().subscribe((usuarios)=>{
      console.log(usuarios)
      this.usuarios = usuarios
    })
    this.databaseService.traerUsuarios().subscribe((usuarios) => {
      //this.usuarios = usuarios
      //this.databaseService.traerHistoriasClinicas(usuario.id)
      //console.log(usuarios)

     
    })
  }

  activar(uid : string, nombre : string, apellido : string){
    Swal.fire({
      title: `Seguro de activar la cuenta del especialista ${nombre} ${apellido}?`,
      icon : "warning",
      showDenyButton: true,
      confirmButtonText: "Activar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.databaseService.activarEspecialista(uid)
        Swal.fire("Cuenta activada!", "", "success");
      }
    });
  }

  desactivar(uid : string, nombre : string, apellido : string){
    Swal.fire({
      title: `Seguro de inhabilitar la cuenta del especialista ${nombre} ${apellido}?`,
      icon : "warning",
      showDenyButton: true,
      confirmButtonText: "Inhabilitar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.databaseService.desactivarEspecialista(uid)
        Swal.fire("Cuenta inhabilitada!", "", "success");
      }
    });

  }

  resetPassword(email : string){
    this.authService.reestablecerPassword(email)
  }


  exportTableToExcel(): void {
    const table = document.querySelector('.user-table') as HTMLElement;
  
    // Convertir la tabla a una hoja de trabajo de Excel
    const worksheet = XLSX.utils.table_to_sheet(table);
  
    // Eliminar la columna de "Acciones" (índice 8)
    const range = XLSX.utils.decode_range(worksheet['!ref'] || '');
    for (let R = range.s.r; R <= range.e.r; R++) {
      delete worksheet[XLSX.utils.encode_cell({ r: R, c: 7 })]; // columna acciones
      delete worksheet[XLSX.utils.encode_cell({ r: R, c: 5 })];
    }
  
    // Ajustar el rango de nuevo
    range.e.c = range.e.c - 2; // restar una columna
    worksheet['!ref'] = XLSX.utils.encode_range(range);
  
    // Crear un libro de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
  
    // Exportar el libro de trabajo a un archivo
    XLSX.writeFile(workbook, 'usuarios.xlsx');
  }


  verHistoriaClinica(usuario:any){
    this.usuarioSeleccionado = usuario
    this.tablaHistoriaClinica = true
  }

  generarExcelPorUsuario(usuarioSeleccionado: any): void {
    const table = document.querySelector('.historia-clinica-table') as HTMLElement;
  
    const worksheet = XLSX.utils.table_to_sheet(table);
  
    const range = XLSX.utils.decode_range(worksheet['!ref'] || '');
    for (let R = range.s.r + 1; R <= range.e.r; R++) { 
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: 0 }); 
      const cell = worksheet[cellAddress];
      if (cell && cell.v) {
        try {
          const originalDate = new Date(cell.v); 
          if (!isNaN(originalDate.getTime())) {
            const formattedDate = originalDate.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });
            cell.v = formattedDate;
            cell.t = 's'; 
          } else {
            console.warn(`Fecha inválida en la celda ${cellAddress}:`, cell.v);
          }
        } catch (error) {
          console.error(`Error al procesar la celda ${cellAddress}:`, error);
        }
      }
    }
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Historia_Clinica_${usuarioSeleccionado.nombre}`);

    XLSX.writeFile(workbook, `Historia_Clinica_${usuarioSeleccionado.nombre}_${usuarioSeleccionado.apellido}.xlsx`);
  }
  
  

}
