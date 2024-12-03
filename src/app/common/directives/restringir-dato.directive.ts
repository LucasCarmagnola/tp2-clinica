import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appRestringirDato]',
  standalone: true
})
export class RestringirDatoDirective {

  datoCensurado = ''


  constructor(private el : ElementRef) { 
  }

  @Input() datoSensible = ''
  



  ngOnInit(){
    if(this.datoSensible){
      const datoCortado = this.datoSensible.slice(3, 8)
      this.datoCensurado = this.datoSensible.replace(datoCortado, '*****')

      this.el.nativeElement.textContent = this.datoCensurado;
    }
  }

  @HostListener('mouseenter') onMouseEnter(){
    this.highlight(this.datoSensible)
  }

  @HostListener('mouseleave') onMouseLeave(){
    this.highlight(this.datoCensurado)
  }

  highlight(datoSensible : string){
    this.el.nativeElement.textContent = datoSensible
  }

}
