import { Routes } from '@angular/router';
import { HeroListComponent } from './features/heroes/components/hero-list/hero-list.component';
import { HeroDetailComponent } from './features/heroes/components/hero-detail/hero-detail.component';

export const routes: Routes = [
    { path: '', component: HeroListComponent },
    { path: 'heroes', component: HeroListComponent },
    { path: 'heroes/:id', component: HeroDetailComponent },
    { path: '**', redirectTo: '' }
];
