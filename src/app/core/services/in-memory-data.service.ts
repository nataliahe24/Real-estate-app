import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const categories: Category[] = [
      { id: '#CAT-2020001', name: 'Casas de lujo', description: 'Propiedades residenciales con acabados de lujo' },
      { id: '#CAT-2020002', name: 'Apartamentos', description: 'Espacios modernos y urbanos' }
    ];
    return { categories };
  }
} 