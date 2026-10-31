import { Component, DebugElement } from '@angular/core';
import { DraggableScrollDirective } from './draggable-scroll.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div appDraggableScroll style="width: 200px; overflow-x: scroll;">
              <div style="width: 600px;">Contenido Largo</div>
            </div>`,
  standalone: true,
  imports: [DraggableScrollDirective]
})
class TestHostComponent{}

describe('DraggableScrollDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let containerElement: HTMLElement;
  let directiveDebugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, DraggableScrollDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    directiveDebugElement = fixture.debugElement.query(By.directive(DraggableScrollDirective));
    containerElement = directiveDebugElement.nativeElement;
  });

  it('should create an instance of the directive', () => {
    expect(directiveDebugElement).toBeTruthy();
  });

  it('should change cursor to grabbing on mousedown and back to pointer on mouseup', () => {
    const mouseDownEvent = new MouseEvent('mousedown',  {pageX: 100} as any);
    containerElement.dispatchEvent(mouseDownEvent);
    fixture.detectChanges();

    expect(containerElement.style.cursor).toBe('grabbing');

    const mouseUpEvent = new MouseEvent('mouseup');
    containerElement.dispatchEvent(mouseUpEvent);
    fixture.detectChanges();

    expect(containerElement.style.cursor).toBe('pointer');
  });

  it('should update scrollLeft when mouse is moved while dragging', () => {
    const mouseDownEvent = new MouseEvent('mousedown',  {pageX: 150} as any);
    containerElement.dispatchEvent(mouseDownEvent);
    
    containerElement.scrollLeft = 50;

    const mouseMove = new MouseEvent('mousemove', {pageX: 100} as any);
    containerElement.dispatchEvent(mouseMove);
    fixture.detectChanges();

    expect(containerElement.scrollLeft).not.toBe(50);

    const mouseUpEvent = new MouseEvent('mouseup');
    containerElement.dispatchEvent(mouseUpEvent);
  });
});
