import { TestBed } from '@angular/core/testing';
import { HeroService } from './hero.service';
import { Hero } from '../models/hero.model';
import { HEROES } from '../mocks/hero.mock';
import { map, switchMap, take } from 'rxjs';

describe('HeroService', () => {
  let service: HeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getHeroes', () => {
    it('should return initial list of heroes', (done) => {
      service.getHeroes().subscribe(heroes => {
        expect(heroes.length).toBe(HEROES.length);
        expect(heroes).toEqual(HEROES);
        done();
      });
    });
  });

  describe('getHeroById', () => {
    it('should return hero by existing ID', (done) => {
      const targetId = 1;
      service.getHeroById(targetId).subscribe(hero => {
        expect(hero).toBeDefined();
        expect(hero?.id).toBe(targetId);
        expect(hero?.name).toBe('Spider-Man');
        done();
      });
    });

    it('should return undefined when hero Id does not exist', (done) => {
      service.getHeroById(999).subscribe(hero => {
        expect(hero).toBeUndefined();
        done();
      });
    });
  });

  describe('searchHeroes', () => {
    it('should filter heroes by name ignoring case', (done) => {
      service.searchHeroes('man').subscribe(heroes => {
        expect(heroes.length).toBeGreaterThan(0);
        const allMatch = heroes.every(hero => hero.name.toLowerCase().includes('man'));
        expect(allMatch).toBeTrue();
        done();
      });
    });

    it('should return all heroes when search term is empty or whitespace', (done) => {
      service.searchHeroes('   ').subscribe(heroes => {
        expect(heroes.length).toBe(HEROES.length);
        done();
      });
    });
  });

  describe('addHero', () => {
    it('should add a new hero and assign a auto-incremented ID', (done) => {
      const newHeroData: Omit<Hero, 'id'> = {
        name: 'Mystique',
        superpower: 'Shapeshifter',
        publisher: 'Marvel',
        alterEgo: 'Raven Darkhölme',
      };

      service.addHero(newHeroData).pipe(switchMap(createdHero => {
        expect(createdHero.name).toBe('Mystique');
        return service.getHeroes().pipe(take(1),
          map(heroes => ({ createdHero, heroes }))
        );
      })).subscribe({
        next: ({ createdHero, heroes }) => {
          const recentlyAddedHero = heroes.find(hero => hero.id === createdHero.id);
          expect(recentlyAddedHero?.id).toBe(createdHero.id);
          done();
        },
        error: (err) => done.fail(err)
      });
    });
  });

  describe('updateHero', () => {
    it('should update an existing hero successfully', (done) => {
      const updatedData: Hero = {
        id: 1,
        name: 'Spider-Man Ultimate',
        superpower: 'Improved powers'
      };

      service.updateHero(updatedData).pipe(switchMap(hero => {
        expect(hero.name).toBe('Spider-Man Ultimate');
        return service.getHeroById(1);
      })).subscribe({
        next: (updatedHero) => {
          expect(updatedHero?.name).toBe('Spider-Man Ultimate');
          done();
        },
        error: (err) => done.fail(err)
      });
    });

    it('should throw an error when trying to update a non-existing hero', (done) => {
      const nonExistingHero: Hero = {
        id: 999,
        name: 'Wolverine',
        superpower: 'Mutant with fast healing'
      };

      service.updateHero(nonExistingHero).subscribe({
        next: () => fail('Should have failed with non-existing ID'),
        error: (error: Error) => {
          expect(error.message).toBe('Hero with id 999 not found');
          done();
        }
      });
    });
  });

  describe('deleteHero', () => {
    it('should delete a hero by ID and return true', (done) => {
      const idToDelete = 2;

      service.deleteHero(idToDelete).pipe(switchMap(deleted => {
        expect(deleted).toBeTrue();
        return service.getHeroById(idToDelete);
      })).subscribe({
        next: (hero) => {
          expect(hero).toBeUndefined();
          done();
        },
        error: (err) => done.fail(err)
      });
    });

    it('should return false when trying to delete a non-existing hero', (done) => {
      service.deleteHero(999).subscribe({
        next: (deleted) => {
          expect(deleted).toBeFalse();
          done();
        },
        error: (err) => done.fail(err)
      });
    });
  });

});
