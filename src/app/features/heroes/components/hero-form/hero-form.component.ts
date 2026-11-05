import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../../../core/services/hero.service';
import { take } from 'rxjs';
import { Hero } from '../../../../core/models/hero.model';
import { PUBLISHERS, CONSTANTS } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    LoadingComponent
  ],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss'
})
export class HeroFormComponent implements OnInit {

  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly heroService = inject(HeroService);

  readonly PUBLISHERS = PUBLISHERS;
  readonly CONSTANTS = CONSTANTS;

  $heroId = signal<number | null>(null);
  $isLoading = signal<boolean>(true);
  $isSaving = signal<boolean>(false);
  $isEditMode = signal<boolean>(false);

  heroForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    superpower: ['', [Validators.required]],
    publisher: [''],
    alterEgo: [''],
    imageUrl: ['']
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.$heroId.set(id);
      this.$isEditMode.set(true);
      this.$isLoading.set(true);

      this.heroService.getHeroById(id).pipe(take(1)).subscribe(hero => {
        if(hero) {
          this.heroForm.patchValue(hero);
          this.$isLoading.set(false);
        } else this.goToHeroesList();
      });
    } else {
      //CREATION MODE
      this.$isEditMode.set(false);
    }
  }

  onSubmit(): void {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }

    this.$isSaving.set(true);
    const formValues = this.heroForm.value;

    if (this.$isEditMode()) {
      const updateHero: Hero = { id: this.$heroId()!, ...formValues };
      this.heroService.updateHero(updateHero).pipe(take(1)).subscribe({
        next: (success) => {
          if (success) this.goToHeroeDetail();
          else this.$isSaving.set(false);
        },
        error: () => this.$isSaving.set(false)
      });
    } else {
      //CREATION LOGIC
    }
  }

  onCancel(): void {
    if (this.$isEditMode())
      this.goToHeroeDetail();
    else
      this.goToHeroesList();
  }

  goToHeroesList(): void {
    this.router.navigate(['/']).catch(err => {
      console.error('Error while navigating: ', err);
    });
  }

  goToHeroeDetail(): void {
    this.router.navigate(['/heroes', this.$heroId()]).catch(err => {
      console.error('Error while navigating: ', err);
    });
  }

}
