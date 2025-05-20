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
  @Input() selectedCategoryName: string = '';
  @Input() selectedCategoryId: number | null = null;
  @Output() categorySelected = new EventEmitter<string>();
  @Output() categoryIdSelected = new EventEmitter<number | null>();

  categories: Category[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategoryNames();
  }

  loadCategoryNames(): void {
    this.isLoading = true;
    this.categoryService.getCategories(0, 100, true).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.categories = response.content.map((category: Category) => ({
            id: category.id,
            name: category.name,
            description: category.description || ''
          }));
        } else {
          this.error = 'El formato de categorías es incorrecto';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar categorías: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  onCategorySelected(): void {
    const selectedCategory = this.categories.find(cat => cat.name === this.selectedCategoryName);
    this.selectedCategoryId = selectedCategory?.id ? +selectedCategory.id : null;
    this.categorySelected.emit(this.selectedCategoryName);
    this.categoryIdSelected.emit(this.selectedCategoryId);
  }
}
