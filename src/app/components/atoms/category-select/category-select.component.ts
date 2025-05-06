import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryService } from '../../../core/services/categories/category.service';
import { Category } from '../../../core/models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss']
})
export class CategorySelectComponent implements OnInit {
  @Input() selectedCategoryId: string = '';
  @Output() categorySelected = new EventEmitter<string>();
  
  categories: Category[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategoryNames();
  }

  loadCategoryNames(): void {
    this.isLoading = true;
    this.categoryService.getCategoryNames(true).subscribe({
      next: (categoryNames) => {
        if (categoryNames && Array.isArray(categoryNames)) {
          this.categories = categoryNames.map((name: any, index) => {
            const categoryName = typeof name === 'object' ? 
              ((name as any).name || String(name) || `Categoría ${index+1}`) : 
              String(name);
            
            return {
              id: index.toString(),
              name: categoryName,
              description: ''
            };
          });
        } else {
          this.error = 'El formato de categorías es incorrecto';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  onCategorySelected(): void {
    this.categorySelected.emit(this.selectedCategoryId);
  }
}