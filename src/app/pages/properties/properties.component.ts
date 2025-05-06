import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../core/services/properties/property.service';
import { PropertyFilter, PropertyResponse } from '../../core/models/property.model';
import { CategoryService } from '../../core/services/categories/category.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {
  properties: PropertyResponse[] = [];
  loading = true;
  error = false;
  currentFilter: PropertyFilter = {};
  viewMode: 'grid' | 'list' = 'grid';
  categories: Category[] = [];
  
  constructor(private propertyService: PropertyService, private categoryService: CategoryService) {}
  
  ngOnInit(): void {
    this.loadProperties();
    this.loadCategories();
  }
  
  loadProperties(): void {
    this.loading = true;
    this.error = false;
    
    this.propertyService.getProperties(this.currentFilter)
      .subscribe({
        next: (data) => {
          this.properties = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading properties', err);
          this.error = true;
          this.loading = false;
        }
      });
  }
  
  onSearch(searchData: {location: string, category: string}): void {
    this.currentFilter = {
      location: searchData.location,
      category: searchData.category
    };
    this.loadProperties();
  }
  
  onViewModeChange(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }
  
  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    // Implement favorite functionality here
    // For example, you could toggle a favorite state in a property
  }
  
  loadCategories(): void {
    this.categoryService.getCategoryNames(true).subscribe({
      next: (categoryNames) => {
        this.categories = categoryNames.map((name, index) => ({
          id: index.toString(),
          name: name,
          description: ''
        }));
      },
      error: (err) => console.error(err)
    });
  }
}