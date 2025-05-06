import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss']
})
export class CategorySelectComponent {
  @Input() categories: { value: string, label: string }[] = [];
  @Output() categoryChange = new EventEmitter<string>();
  
  selectedCategory: string = '';
  
  onSelectChange(): void {
    this.categoryChange.emit(this.selectedCategory);
  }
} 