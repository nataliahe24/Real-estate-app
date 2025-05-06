import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-properties-header',
  templateUrl: './properties-header.component.html',
  styleUrls: ['./properties-header.component.scss']
})
export class PropertiesHeaderComponent {
  @Output() search = new EventEmitter<{location: string, category: string}>();
  
  onSearch(searchData: {location: string, category: string}): void {
    this.search.emit(searchData);
  }
} 