import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDialogComponent } from './delete-dialog.component';
import { HeroService } from '../../../../core/services/hero.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

describe('DeleteDialogComponent', () => {
  let component: DeleteDialogComponent;
  let fixture: ComponentFixture<DeleteDialogComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DeleteDialogComponent>>;

  const dialogData = { isDeleting: false, idToDelete: 1 };

  beforeEach(async () => {

    mockHeroService = jasmine.createSpyObj('HeroService', ['deleteHero']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    
    await TestBed.configureTestingModule({
      imports: [DeleteDialogComponent],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with false when onCancel is called', () => {
    component.onCancel();

    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should delete the hero successfully and close the dialog with true onConfirm', () => {
    mockHeroService.deleteHero.and.returnValue(of(true));
    component.onConfirm();

    expect(component.$isDeleting()).toBeTrue();
    expect(mockHeroService.deleteHero).toHaveBeenCalledWith(1);
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should handle error during deletion, reset $isDeleting, and close dialog with false', () => {
    mockHeroService.deleteHero.and.returnValue(throwError(() => new Error('Error deleting')));
    component.onConfirm();

    expect(component.$isDeleting()).toBeFalse();
    expect(mockHeroService.deleteHero).toHaveBeenCalledWith(1);
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});
