import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { CONSTANTS } from '../../../../core/constants/app.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './hero-search.component.html',
  styleUrl: './hero-search.component.scss'
})
export class HeroSearchComponent {

  @Output() searchChange = new EventEmitter<string>();

  readonly CONSTANTS = CONSTANTS;
  searchControl = new FormControl('', { nonNullable: true });

  constructor() {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      map(value => value.trim()),
      takeUntilDestroyed()
    ).subscribe(term => {
      if (term.length >= 3 || term.length === 0)
        this.searchChange.emit(term);
      else
        this.searchChange.emit('');
    });
  }
}
