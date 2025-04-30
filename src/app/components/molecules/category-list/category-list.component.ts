import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {
  @Input() categories: Category[] = [];
  @Output() deleteCategory = new EventEmitter<string | number>();
  
  currentPage = 1;
  itemsPerPage = 5;
  
  get paginatedCategories(): Category[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.categories.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  get totalPages(): number {
    return Math.ceil(this.categories.length / this.itemsPerPage);
  }
  
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  onDelete(id: string | number | undefined): void {
    if (id !== undefined) {
      this.deleteCategory.emit(id);
    }
  }
} 