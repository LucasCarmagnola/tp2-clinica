import { Directive, ElementRef, HostListener, Input, Renderer2  } from '@angular/core';

@Directive({
  selector: '[appAgrandarElemento]',
  standalone: true
})
export class AgrandarElementoDirective {

  @Input() escala = '2'
  escalaNativa = '1'

  constructor(private el : ElementRef, private renderer: Renderer2) { 
  }


  @HostListener('click') onClick() {
    this.agrandar(this.escala);
    this.escucharClickAfuera(); 
  }


  agrandar(escala : string){
    this.el.nativeElement.style.transform = `scale(${escala})`
    this.el.nativeElement.style.transition = 'transform 0.3s';
    this.el.nativeElement.style.position = 'absolute'
    this.el.nativeElement.style.top = '40%'
    this.el.nativeElement.style.left = '45%'
  }

  escucharClickAfuera() {
    this.renderer.listen('document', 'click', (event) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.agrandar(this.escalaNativa); 
        this.el.nativeElement.style.position = ''
        this.el.nativeElement.style.top = ''
        this.el.nativeElement.style.left = ''
      }
    });
  }
  // @HostListener('mouseenter') onMouseEnter(){
  //   this.agrandar(this.escala)
  // }

  // @HostListener('mouseleave') onMouseLeave(){
  //   this.agrandar(this.escalaNativa)
  // }


}
