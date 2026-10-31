import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Hero } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero.service';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { DraggableScrollDirective } from '../../../../shared/directives/draggable-scroll.directive'

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    DraggableScrollDirective,
    RouterLink
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss'
})
export class HeroListComponent implements OnInit {

  private heroService = inject(HeroService);
  heroes$!: Observable<Hero[]>;

  ngOnInit(): void {
    this.heroes$ = this.heroService.getHeroes();
  }

}
