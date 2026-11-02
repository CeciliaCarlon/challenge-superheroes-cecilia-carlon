import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

const LOADING = "CARGANDO...";
const TOTAL_BLOCKS = 10;

@Component({
  selector: 'app-loading',
  imports: [ CommonModule ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {

  LOADING = LOADING;
  blocks = Array.from({length: TOTAL_BLOCKS}, (_, index) => index);

  getBlockDelay(index: number): string {
    const step = 2 / TOTAL_BLOCKS;
    return `${index * step}s`;
  }
}
