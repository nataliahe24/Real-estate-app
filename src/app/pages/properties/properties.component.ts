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
  
  propertyImages = [
    'assets/images/casa-1.png',
    'assets/images/casa-2.png',
    'assets/images/casa-3.png',
    'assets/images/casa-4.png'
  ];
  
  constructor(private propertyService: PropertyService) {}
  
  ngOnInit(): void {
    this.loadProperties();
    
  }
  
  loadProperties(): void {
    this.loading = true;
    this.error = false;
    
    this.propertyService.getProperties(this.currentFilter)
      .subscribe({
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
  
  onSearch(searchData: {location: string, category: string}): void {
    this.currentFilter = {
      location: searchData.location,
      category: searchData.category
    };
    this.loadProperties();
  }
  
  onViewModeChange(event: any): void {
    this.viewMode = event as 'grid' | 'list';
  }
  
  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
   
  }
}