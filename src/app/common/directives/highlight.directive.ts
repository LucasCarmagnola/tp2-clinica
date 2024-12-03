import { Directive, ElementRef, HostListener, input, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {

  @Input() color = 'blue'
  @Input() colorNativo = 'blue'

  constructor(private el : ElementRef) { 
  }


  @HostListener('mouseenter') onMouseEnter(){
    this.highlight(this.color)
  }

  @HostListener('mouseleave') onMouseLeave(){
    this.highlight(this.colorNativo)
  }

  highlight(color : string){
    this.el.nativeElement.style.color = color
  }
}
