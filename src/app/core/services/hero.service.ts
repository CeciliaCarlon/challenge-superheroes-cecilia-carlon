import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hero } from '../models/hero.model';
import { HEROES } from '../mocks/hero.mock';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesSubject: BehaviorSubject<Hero[]> = new BehaviorSubject<Hero[]>(HEROES);
  public heroes$: Observable<Hero[]> = this.heroesSubject.asObservable();

  constructor() { }

  getHeroes(): Observable<Hero[]> {
    return this.heroes$;
  }

  getHeroById(id: number): Observable<Hero | undefined> {
    const hero = this.heroesSubject.getValue().find(h => h.id === id);
    return of(hero);
  }

  searchHeroes(term: string): Observable<Hero[]> {
    const cleanTerm = term.trim().toLocaleLowerCase();

    if(!cleanTerm) return this.heroes$;

    return this.heroes$.pipe(
      map(heroes => heroes.filter(hero => hero.name.toLocaleLowerCase().includes(cleanTerm)))
    );
  }

  addHero(hero: Omit<Hero, 'id'>): Observable<Hero> {
    const currentHeroes = this.heroesSubject.getValue();
    const newId = currentHeroes.length > 0
      ? Math.max(...currentHeroes.map(h => h.id)) + 1
      : 1;
    const newHero: Hero = { ...hero, id: newId };

    this.heroesSubject.next([...currentHeroes, newHero]);
    return of(newHero);
  }

  updateHero(updatedHero: Hero): Observable<Hero> {
    const heroes = this.heroesSubject.getValue();
    const index = heroes.findIndex(hero => hero.id === updatedHero.id);

    if (index === -1) return throwError(() => new Error(`Hero with id ${updatedHero.id} not found`));

    const updatedHeroes = [...heroes];
    updatedHeroes[index] = {...updatedHero};
    this.heroesSubject.next(updatedHeroes);

    return of(updatedHero);
  }

  deleteHero(id: number): Observable<boolean> {
    const heroes = this.heroesSubject.getValue();
    const filteredHeroes = heroes.filter(hero => hero.id !== id);

    if (filteredHeroes.length === heroes.length) return of(false);

    this.heroesSubject.next(filteredHeroes);

    return of(true);
  }
}
