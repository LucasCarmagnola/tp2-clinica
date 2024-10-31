import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent {

  protected usuarios : any[] = []
  protected emailVerified : any

  constructor(private databaseService : DatabaseService, private authService : AuthService){

  }

  ngOnInit(){
    this.emailVerified = this.authService.emailVerified
    this.databaseService.traerUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios
    })
  }

  activar(uid : string, nombre : string, apellido : string){
    Swal.fire({
      title: `Seguro de activar la cuenta del especialista ${nombre} ${apellido}?`,
      showDenyButton: true,
      confirmButtonText: "Activar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.databaseService.activarEspecialista(uid)
        Swal.fire("Cuenta activada!", "", "success");
      }
    });
  }

  desactivar(uid : string, nombre : string, apellido : string){
    Swal.fire({
      title: `Seguro de inhabilitar la cuenta del especialista ${nombre} ${apellido}?`,
      showDenyButton: true,
      confirmButtonText: "Inhabilitar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.databaseService.desactivarEspecialista(uid)
        Swal.fire("Cuenta inhabilitada!", "", "success");
      }
    });

  }

  resetPassword(email : string){
    this.authService.reestablecerPassword(email)
  }

}
