export interface Hero {
    id: number;
    name: string;
    superpower: string;
    publisher?: 'Marvel' | 'DC' | 'Other';
    alterEgo?: string;
    imageUrl?: string;
}