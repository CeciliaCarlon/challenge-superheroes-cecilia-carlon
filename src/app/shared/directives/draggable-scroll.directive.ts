import { Directive, ElementRef, Host, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appDraggableScroll]',
  standalone: true,
})
export class DraggableScrollDirective {

  private element = inject(ElementRef<HTMLElement>);
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.pageX - this.element.nativeElement.offsetLeft;
    this.scrollLeft = this.element.nativeElement.scrollLeft;
    this.element.nativeElement.style.cursor = 'grabbing';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - this.element.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.5;
    this.element.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  onMouseUp():void {
    this.isDragging = false;
    this.element.nativeElement.style.cursor = 'pointer';
  }

}
