import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroDetailComponent } from './hero-detail.component';
import { HeroService } from '../../../../core/services/hero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Hero } from '../../../../core/models/hero.model';
import { of } from 'rxjs';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockHero: Hero = {
    id: 1,
    name: 'Spider-Man',
    superpower: 'Wall-crawling',
    publisher: 'Marvel',
    alterEgo: 'Peter Parker',
    imageUrl: 'url'
  };

  const setupTestBed = async (routeIdParam: string | null) => {
    mockHeroService = jasmine.createSpyObj('HeroService', ['getHeroById']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    const activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => routeIdParam
        }
      }
    };

    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [HeroDetailComponent],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
  };

  describe('when route has a valid hero ID', () => {
    beforeEach(async () => {
      await setupTestBed('1');
      mockHeroService.getHeroById.and.returnValue(of(mockHero));
      fixture.detectChanges();
    });

    it ('should create the component and load the hero', () => {
      expect(component).toBeTruthy();
      expect(mockHeroService.getHeroById).toHaveBeenCalledWith(1);
      expect(component.$hero()).toEqual(mockHero);
    });

    it ('should navigate back when goBack is called', () => {
      component.goBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it ('should navigate to edit view when onEdit is called', () => {
      component.onEdit();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes', 1, 'edit']);
    });

    it ('should open delete modal and go back if confirmed', () => {
      const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
      mockDialog.open.and.returnValue(dialogRefSpyObj);

      component.openDeleteModal(1);

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it ('should open delete modal and not go back if not confirmed', () => {
      const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(false) });
      mockDialog.open.and.returnValue(dialogRefSpyObj);

      component.openDeleteModal(1);

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
    });
  });

  describe('when hero is not found or ID is invalid', () => {
    it ('should redirect via goBack if hero does not exist', async () => {
      await setupTestBed('999');
      mockHeroService.getHeroById.and.returnValue(of(undefined as any));

      fixture.detectChanges();

      expect(component.$hero()).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
