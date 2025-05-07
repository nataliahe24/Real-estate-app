import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../../core/services/properties/property.service';
import { CategorySelectComponent } from '../../atoms/category-select/category-select.component';
import { PropertyResponse } from '../../../core/models/property.model';


@Component({
  selector: 'app-property-search',
  templateUrl: './property-search.component.html',
  styleUrls: ['./property-search.component.scss']
})
export class PropertySearchComponent implements OnInit {
  selectedCategoryId: string = '';
  locationQuery: string = '';
  properties: PropertyResponse[] = [];
  isLoading = false;
  error: string | null = null;
  selectedCategoryName: string = '';

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.searchProperties();
  }

  onCategorySelected(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.searchProperties();
  }

  onLocationSearchChange(): void {
    this.searchProperties();
  }

  onCategoryChange(categoryName: string): void {
    this.selectedCategoryName = categoryName;
    // this.searchProperties(); // si tienes lógica de búsqueda
  }

  searchProperties(): void {
    this.isLoading = true;
    this.error = null;

    const filters: any = {};
    
    if (this.selectedCategoryId) {
      filters.category = this.selectedCategoryId;
    }
    
    if (this.locationQuery) {
      filters.location = this.locationQuery;
    }

    this.propertyService.getProperties(filters).subscribe({
      next: (response) => {
        this.properties = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load properties';
        this.isLoading = false;
        console.error('Error loading properties:', err);
      }
    });
  }
} 