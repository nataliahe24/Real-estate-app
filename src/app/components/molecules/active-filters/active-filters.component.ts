import { Component, Input, Output, EventEmitter } from '@angular/core';

export type FilterType = 'rooms' | 'bathrooms' | 'minPrice' | 'maxPrice';

export interface ActiveFilter {
  rooms?: string;
  bathrooms?: string;
  minPrice?: string;
  maxPrice?: string;
}

@Component({
  selector: 'app-active-filters',
  templateUrl: './active-filters.component.html',
  styleUrls: ['./active-filters.component.scss']
})
export class ActiveFiltersComponent {
  @Input() filters: ActiveFilter = {};
  @Output() removeFilter = new EventEmitter<FilterType>();

  hasActiveFilters(): boolean {
    return Object.keys(this.filters).length > 0;
  }

  onRemoveFilter(filter: FilterType): void {
    this.removeFilter.emit(filter);
  }
} 