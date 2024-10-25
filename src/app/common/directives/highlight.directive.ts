import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {

  @Input() color = 'red'

  constructor(private el : ElementRef) { 
    console.log(el)
  }


  @HostListener('mouseenter') onMouseEnter(){
    this.highlight(this.color)
  }

  @HostListener('mouseleave') onMouseLeave(){
    this.highlight('')
  }

  highlight(color : string){
    this.el.nativeElement.style.backgroundColor = color
  }
}
