import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CategoryService } from '../../../core/services/categories/category.service';
import { Category } from '../../../core/models/category.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class SearchFormComponent implements OnInit {
  @Output() search = new EventEmitter<{location: string, category: string}>();
  
  location: string = '';
  category: string = '';
  categories: Category[] = [];
  isLoading = true;
  error: string | null = null;
  
  constructor(private categoryService: CategoryService) {}
  
  ngOnInit(): void {
    this.loadCategories();
  }
  
  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategoryNames(true).subscribe({
      next: (categoryNames) => {
        this.categories = categoryNames.map((name, index) => ({
          id: index.toString(),
          name: name,
          description: ''
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories: ' + err.message;
        this.isLoading = false;
      }
    });
  }
  
  onLocationChange(value: string): void {
    this.location = value;
  }
  
  onCategoryChange(value: string): void {
    this.category = value;
  }
  
  onSearch(): void {
    this.search.emit({
      location: this.location,
      category: this.category
    });
  }
} 