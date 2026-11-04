import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HeroService } from '../../../../core/services/hero.service';
import { take } from 'rxjs';
import { DELETE_HEROE_QUESTION, DELETING_HEROE_LOADING, YES, NO } from '../../../../core/constants/app.constants'

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {

  private readonly heroService = inject(HeroService);
  readonly DELETE_HEROE_QUESTION = DELETE_HEROE_QUESTION;
  readonly DELETING_HEROE_LOADING = DELETING_HEROE_LOADING;
  readonly YES = YES;
  readonly NO = NO;

  dialogRef = inject(MatDialogRef<DeleteDialogComponent>);
  data = inject<{ isDeleting: boolean, idToDelete: number }>(MAT_DIALOG_DATA);
  $isDeleting = signal(false);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.$isDeleting.set(true);
    this.heroService.deleteHero(this.data.idToDelete).pipe(take(1)).subscribe({
      next: (success: boolean) => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.$isDeleting.set(false);
        this.dialogRef.close(false);
      }
    });
  }
}
