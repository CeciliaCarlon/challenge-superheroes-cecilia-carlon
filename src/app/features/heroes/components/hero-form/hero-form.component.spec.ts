import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroFormComponent } from './hero-form.component';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { HeroService } from '../../../../core/services/hero.service';
import { Hero } from '../../../../core/models/hero.model';
import { of, throwError } from 'rxjs';

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;
  let heroServiceSpy: jasmine.SpyObj<HeroService>;
  let router: Router;

  const mockHero: Hero = {
    id: 1,
    name: 'Batman',
    superpower: 'Intelligence',
    publisher: 'DC',
    alterEgo: 'Bruce Wayne',
    imageUrl: 'batman.jpg'
  };

  const setupTestBed = async (idParam: string | null = null) => {
    heroServiceSpy = jasmine.createSpyObj('HeroService', ['getHeroById', 'addHero', 'updateHero']);

    const ActivatedRouteStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => idParam
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ HeroFormComponent ],
      providers: [
        provideRouter([]),
        { provide: HeroService, useValue: heroServiceSpy },
        { provide: ActivatedRoute, useValue: ActivatedRouteStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  };

  describe('When in Creation Mode (no ID)', () => {
    beforeEach(async () => {
      await setupTestBed(null);
      fixture.detectChanges();
    });

    it ('should create the component and start in creation mode', () => {
      expect(component).toBeTruthy();
      expect(component.$isEditMode()).toBeFalse();
      expect(component.$isLoading()).toBeFalse();
    });

    it ('should mark form as invalid when required fields are empty', () => {
      expect(component.heroForm.invalid).toBeTrue();

      component.heroForm.controls['name'].setValue('A');
      component.heroForm.controls['superpower'].setValue('');
      expect(component.heroForm.invalid).toBeTrue();
    });

    it ('should call addHero and navigate to /heroes on successful submit', () => {
      heroServiceSpy.addHero.and.returnValue(of(mockHero));
      component.heroForm.setValue({
        name: 'Superman',
        superpower: 'Flight',
        publisher: 'DC',
        alterEgo: 'Clark',
        imageUrl: 'superman.jpg'
      });

      component.onSubmit();
      
      expect(heroServiceSpy.addHero).toHaveBeenCalledWith({
        name: 'Superman',
        superpower: 'Flight',
        publisher: 'DC',
        alterEgo: 'Clark',
        imageUrl: 'superman.jpg'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
    });

    it ('should not submit if form is invalid', () => {
      component.onSubmit();
      expect(heroServiceSpy.addHero).not.toHaveBeenCalled();
      expect(component.$isSaving()).toBeFalse();
    });

    it ('should navigate back to heroes list on cancel', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('When in Edit Mode (with valid ID', () => {
    beforeEach(async () => {
      heroServiceSpy.getHeroById.and.returnValue(of(mockHero));
      await setupTestBed('1');
      fixture.detectChanges();
    });

    it ('should load hero data and set edit mode to true', () => {
      expect(component.$isEditMode()).toBeTrue();
      expect(component.$heroId()).toBe(1);
      expect(heroServiceSpy.getHeroById).toHaveBeenCalledWith(1);
      expect(component.heroForm.value.name).toBe('Batman');
      expect(component.$isLoading()).toBeFalse();
    });

    it ('should call updateHero and navigate to detail view on successful submit', () => {
      component.heroForm.patchValue({ name: 'Batman Updated' });
      component.onSubmit();

      expect(heroServiceSpy.updateHero).toHaveBeenCalledWith({
        id: 1,
        name: 'Batman Updated',
        superpower: 'Intelligence',
        publisher: 'DC',
        alterEgo: 'Bruce Wayne',
        imageUrl: 'batman.jpg'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/heroes', 1]);
    });

    it ('should handle error during update gracefully', () => {
      heroServiceSpy.updateHero.and.returnValue(throwError(() => new Error('Update failed')));

      component.heroForm.patchValue({ name: 'Batman' });
      component.onSubmit();

      expect(component.$isSaving()).toBeFalse();
    });

    it ('should navigate back to hero detail on cancel in edit mode', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/heroes', 1]);
    });
  });
});
