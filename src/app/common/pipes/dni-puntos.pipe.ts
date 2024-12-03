import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dniPuntos',
  standalone: true
})
export class DniPuntosPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    const dni = value.replace(/\D/g, ''); 
    const longitud = dni.length;

    if (longitud <= 3) return dni;

    return dni.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

}
