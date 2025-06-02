import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-properties-toolbar',
  templateUrl: './properties-toolbar.component.html',
  styleUrls: ['./properties-toolbar.component.scss']
})
export class PropertiesToolbarComponent {
  @Input() totalCount: number = 0;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Output() viewModeChange = new EventEmitter<'grid' | 'list'>();
  @Output() sortChange = new EventEmitter<string>();
  @Output() orderChange = new EventEmitter<boolean>();
  
  sortByControl = new FormControl('');
  
  sortOptions = [
    { value: 'price', label: 'Precio' },
    { value: 'rooms', label: 'Habitaciones' },
    { value: 'bathrooms', label: 'Baños' },
    { value: 'category', label: 'Categoría' },
    { value: 'location', label: 'Ubicación' }
    
  ];
  
  orderAsc = true;
  
  ngOnInit(): void {
    this.sortByControl.valueChanges.subscribe(value => {
      if (value) {
        this.sortChange.emit(value);
      }
    });
  }
  
  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewModeChange.emit(mode);
  }
  
  toggleOrder(): void {
    this.orderAsc = !this.orderAsc;
    this.orderChange.emit(this.orderAsc);
  }
} 