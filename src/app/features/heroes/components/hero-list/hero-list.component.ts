import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { HeroService } from '../../../../core/services/hero.service';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { CONSTANTS } from '../../../../core/constants/app.constants';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [ CommonModule, MatButtonModule, MatIconModule, RouterLink, LoadingComponent
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss'
})
export class HeroListComponent {

  private readonly heroService = inject(HeroService);
  readonly CONSTANTS = CONSTANTS;

  $heroes = toSignal(this.heroService.getHeroes());
  $currentPage = signal<number>(1);
  itemsPerPage = 4;

  $totalPages = computed<number>(() => {
    const heroes = this.$heroes();
    if (!heroes || heroes.length === 0) return 1;
    const total = heroes.length;
    return Math.max(1, Math.ceil(total / this.itemsPerPage));
  });

  $paginatedHeroes = computed(() => {
    const heroes = this.$heroes();
    if (!heroes || heroes.length === 0) return [];
    const start = (this.$currentPage() - 1) * this.itemsPerPage;
    return heroes.slice(start, start + this.itemsPerPage);
  });

  $totalPagesArray = computed(() => {
    return Array.from({ length: this.$totalPages() }, (_, i) => i + 1);
  });

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.$totalPages()) {
      this.$currentPage.set(page);
    }
  }

  prevPage(): void {
    if (this.$currentPage() > 1) {
      this.$currentPage.update(p => p - 1);
    }
  }

  nextPage(): void {
    if (this.$currentPage() < this.$totalPages()) {
      this.$currentPage.update(p => p + 1);
    }
  }

  handleSwipe(direction: 'next' | 'prev'): void {
    if (direction === 'next')
      this.nextPage();
    else
      this.prevPage();
  }

}
