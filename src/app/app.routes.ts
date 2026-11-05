import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/heroes/components/hero-list/hero-list.component').then(m => m.HeroListComponent)
    },
    {
        path: 'heroes',
        loadComponent: () => import('./features/heroes/components/hero-list/hero-list.component').then(m => m.HeroListComponent)
    },
    { 
        path: 'heroes/:id',
        loadComponent: () => import('./features/heroes/components/hero-detail/hero-detail.component').then(m => m.HeroDetailComponent)
    },
    {
        path: 'heroes/:id/edit',
        loadComponent: () => import('./features/heroes/components/hero-form/hero-form.component').then(m => m.HeroFormComponent)
    },
    { path: '**', redirectTo: '' }
];
