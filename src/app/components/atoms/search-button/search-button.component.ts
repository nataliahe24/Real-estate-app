import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-button',
  templateUrl: './search-button.component.html',
  styleUrls: ['./search-button.component.scss']
})
export class SearchButtonComponent {
  @Input() text: string = 'Buscar';
  @Output() buttonClick = new EventEmitter<void>();
  
  onClick(): void {
    this.buttonClick.emit();
  }
} 