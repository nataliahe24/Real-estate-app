import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent {
  @Input() placeholder: string = 'Buscar por ubicación';
  @Output() valueChange = new EventEmitter<string>();
  
  inputValue: string = '';
  
  onInputChange(): void {
    this.valueChange.emit(this.inputValue);
  }
} 