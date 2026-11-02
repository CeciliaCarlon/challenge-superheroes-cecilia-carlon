import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../../../core/services/hero.service';
import { Hero } from '../../../../core/models/hero.model';
import { take } from 'rxjs';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

const UNKNOWN = 'UNKNOWN';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [ CommonModule, MatIconModule, MatButtonModule, LoadingComponent, UpperCasePipe ],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.scss'
})
export class HeroDetailComponent implements OnInit{

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private heroService = inject(HeroService);

  UNKNOWN = UNKNOWN;
  $hero = signal<Hero | null>(null);

  ngOnInit(): void {
    const idParam =   this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.heroService.getHeroById(Number(idParam)).pipe(take(1)).subscribe(
        hero => {
          if(hero) this.$hero.set(hero)
          else this.router.navigate(['/']);
        }
      );
    }
  }
}
