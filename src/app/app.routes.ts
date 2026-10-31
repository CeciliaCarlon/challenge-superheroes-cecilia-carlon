import { Routes } from '@angular/router';
import { HeroListComponent } from './features/heroes/components/hero-list/hero-list.component';

export const routes: Routes = [
    {
        path: '',
        component: HeroListComponent
    },
    {
        path: 'heroes',
        component: HeroListComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
