import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeroListComponent } from './hero-list.component';
import { HeroService } from '../../../../core/services/hero.service';
import { Hero } from '../../../../core/models/hero.model';
import { of } from 'rxjs';

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let heroServiceSpy: jasmine.SpyObj<HeroService>;

  const mockHeroes: Hero[] = [
    { id: 1, name: 'Spider-Man', superpower: 'Trepar paredes, disparo de telarañas', publisher: 'Marvel', alterEgo: 'Peter Parker', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfNpCINGtY0hehPAPEBiafYi5j7l8mm_PFDlKlpAgfLa4vhpQsKuSz-xs&s=10' },
    { id: 2, name: 'batman', superpower: 'Condición humana óptima, artes marciales', publisher: 'DC', alterEgo: 'Bruce Wayne', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ_leJRo59i2-zjdHOGgdpIHf-e6HaqPsFDMSnbj_8uirQStTLUOK55mI&s=10' },
    { id: 3, name: 'Mujer Maravilla', superpower: 'Súper fuerza, vuelo, habilidades de combate', publisher: 'DC', alterEgo: 'Princesa Diana', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT49zCzgxrUzIzpAh7O9rFHyBXF-ulag8zB33dhS4tUCH3Jbm46I6aSs-0J&s=10' },
    { id: 4, name: 'Iron Man', superpower: 'Armadura robótica avanzada, intelecto de nivel genio', publisher: 'Marvel', alterEgo: 'Tony Stark', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjSYkpCVMlVLgz10KSqDgED2sn8EdOs7o28qyx9lQdWJ_fwtq8QBe5rXpI&s=10' },
    { id: 5, name: 'Capitán América', superpower: 'Fuerza y agilidad mejoradas, táctico experto', publisher: 'Marvel', alterEgo: 'Steve Rogers', imageUrl: 'https://www.akiracomics.com/imagenes/poridentidad?identidad=61e40d58-3c1c-4fb6-8beb-7b049b5d5ee7&ancho=850&alto=' },
  ]

  beforeEach(async () => {
    heroServiceSpy = jasmine.createSpyObj('HeroService', ['getHeroes', 'searchHeroes']);

    heroServiceSpy.getHeroes.and.returnValue(of(mockHeroes));
    heroServiceSpy.searchHeroes.and.callFake((term: string) => {
      const filtered = mockHeroes.filter(h => h.name.toLowerCase().includes(term.toLowerCase()));
      return of(filtered);
    });

    await TestBed.configureTestingModule({
      imports: [HeroListComponent],
      providers: [
        provideRouter([]),
        { provide: HeroService, useValue: heroServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and load heroes', () => {
    expect(component).toBeTruthy();
    expect(heroServiceSpy.getHeroes).toHaveBeenCalled();
    expect(component.$heroes()).toEqual(mockHeroes);
  });

  describe('Pagination Logic', () => {
    it('should calculate total pages correctly based on itemsPerPage (4 items per page', () => {
      expect(component.$totalPages()).toBe(2);
      expect(component.$totalPagesArray()).toEqual([1, 2]);
    });

    it('should slice paginated heroes correcly for current page', () => {
      expect(component.$currentPage()).toBe(1);
      expect(component.$paginatedHeroes().length).toBe(4);
      expect(component.$paginatedHeroes()[0].name).toBe('Spider-Man');

      component.onPageChange(2);
      expect(component.$currentPage()).toBe(2);
      expect(component.$paginatedHeroes().length).toBe(1);
      expect(component.$paginatedHeroes()[0].name).toBe('Capitán América');
    });

    it('should handle nextPage and prevPage correcly', () => {
      expect(component.$currentPage()).toBe(1);

      component.nextPage();
      expect(component.$currentPage()).toBe(2);

      component.nextPage();
      expect(component.$currentPage()).toBe(2);

      component.prevPage();
      expect(component.$currentPage()).toBe(1);

      component.prevPage();
      expect(component.$currentPage()).toBe(1);
    });

    it('should handle swipe actions correcly', () => {
      expect(component.$currentPage()).toBe(1);

      component.handleSwipe('next');
      expect(component.$currentPage()).toBe(2);

      component.handleSwipe('prev');
      expect(component.$currentPage()).toBe(1);
    });
  });

  describe('Search Logic', () => {
    it('should filter heroes and reset to page 1 when search term is updated with 3 or more chars', () => {
      component.onPageChange(2);
      expect(component.$currentPage()).toBe(2);

      component.onSearchChange('bat');
      fixture.detectChanges();

      expect(component.$searchTerm()).toBe('bat');
      expect(component.$currentPage()).toBe(1);
      expect(heroServiceSpy.searchHeroes).toHaveBeenCalledWith('bat');
      expect(component.$heroes()?.length).toBe(1);

      const heroResult = component.$heroes();
      expect(heroResult?.length).toBe(1);

      const searchResult = heroResult?.find(h => h.name == 'batman')
      expect(searchResult).toBeDefined();
      expect(searchResult?.name).toBe('batman');
    });

    it('should call getHeroes if search term is cleared or less than 3 characters', () => {
      component.onSearchChange('ba');
      fixture.detectChanges();

      expect(heroServiceSpy.getHeroes).toHaveBeenCalled();
      expect(component.$heroes()).toEqual(mockHeroes);
    })
  })
});
