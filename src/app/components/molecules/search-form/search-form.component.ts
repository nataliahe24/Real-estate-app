import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CategoryService } from '../../../core/services/categories/category.service';
import { Category } from '../../../core/models/category.model';
import { PropertyService } from '@app/core/services/properties/property.service';
import { PropertyFilter, PropertyResponse } from '../../../core/models/property.model';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  @Output() search = new EventEmitter<{ location: string, category: string }>();

  location: string = '';
  category: string = '';
  categories: Category[] = [];
  properties: PropertyResponse[] = [];
  currentFilter: PropertyFilter = {};
  viewMode: 'grid' | 'list' = 'grid';

  loading = true;
  error = false;

  constructor(
    private categoryService: CategoryService,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProperties();
  }

  loadCategories(): void {
    this.categoryService.getCategories(0, 100, true).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.categories = response.content.map((category: Category) => ({
            id: category.id,
            name: category.name,
            description: category.description || ''
          }));
        } else {
          this.error = true;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadProperties(): void {
    this.loading = true;
    this.error = false;

    this.propertyService.getProperties(this.currentFilter).subscribe({
      next: (data: PropertyResponse[]) => {
        this.properties = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar propiedades', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  onCategoryChange(categoryName: string): void {
    this.category = categoryName;
    this.currentFilter.category = categoryName;
    this.loadProperties();
  }

  onSearch(): void {
    this.search.emit({
      location: this.location,
      category: this.category
    });
  }
}
