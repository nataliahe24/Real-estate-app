import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {
  @Output() search = new EventEmitter<{location: string, category: string}>();
  
  location: string = '';
  category: string = '';
  
  categories = [
    { value: 'casa', label: 'Casa' },
    { value: 'apartamento', label: 'Apartamento' },
    { value: 'oficina', label: 'Oficina' },
    { value: 'local', label: 'Local' }
  ];
  
  onLocationChange(value: string): void {
    this.location = value;
  }
  
  onCategoryChange(value: string): void {
    this.category = value;
  }
  
  onSearch(): void {
    this.search.emit({
      location: this.location,
      category: this.category
    });
  }
} 