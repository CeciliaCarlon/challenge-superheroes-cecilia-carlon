import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../../../core/services/hero.service';
import { Hero } from '../../../../core/models/hero.model';
import { take } from 'rxjs';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { CONSTANTS } from '../../../../core/constants/app.constants'

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [ CommonModule, MatIconModule, MatButtonModule, LoadingComponent, UpperCasePipe ],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.scss'
})
export class HeroDetailComponent implements OnInit{

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly heroService = inject(HeroService);
  private readonly dialog = inject(MatDialog);
  readonly CONSTANTS = CONSTANTS;
  
  $hero = signal<Hero | null>(null);

  ngOnInit(): void {
    const idParam =   this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.heroService.getHeroById(Number(idParam)).pipe(take(1)).subscribe(
        hero => {
          if(hero) this.$hero.set(hero)
          else this.goBack();
        }
      );
    }
  }

  goBack() :void {
    this.router.navigate(['/']).catch(err => {
      console.error('Error while navigating: ', err)
    });
  }

  openDeleteModal(id: number): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: CONSTANTS.DIALOG_WIDTH,
      data: { isDeleting: false, idToDelete: id },
      disableClose: true,
      panelClass: 'custom-arcade-dialog-container'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) this.goBack();
      else console.log('error')
    });
  }

  onEdit(): void {
    const id = this.$hero()?.id;
    if (id) void this.router.navigate(['/heroes', id, 'edit']);
  }
}