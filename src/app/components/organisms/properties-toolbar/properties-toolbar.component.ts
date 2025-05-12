import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-properties-toolbar',
  templateUrl: './properties-toolbar.component.html',
  styleUrls: ['./properties-toolbar.component.scss']
})
export class PropertiesToolbarComponent {
  @Input() totalCount: number = 0;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Output() viewModeChange = new EventEmitter<'grid' | 'list'>();
  
  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewModeChange.emit(mode);
  }
} 