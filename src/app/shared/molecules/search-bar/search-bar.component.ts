import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  template: `
    <div class="search-bar">
      <input 
        type="text" 
        [placeholder]="placeholder"
        [(ngModel)]="searchTerm"
        (keyup.enter)="onSearch()"
      >
      <app-button 
        variant="primary"
        (onClick)="onSearch()">
        Search
      </app-button>
    </div>
  `,
  styles: [`
    .search-bar {
      display: flex;
      gap: 0.5rem;
      max-width: 500px;
      margin: 0 auto;
    }

    input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
  `]
})
export class SearchBarComponent {
  searchTerm = '';
  placeholder = 'Search properties...';
  @Output() search = new EventEmitter<string>();

  onSearch(): void {
    this.search.emit(this.searchTerm);
  }
} 