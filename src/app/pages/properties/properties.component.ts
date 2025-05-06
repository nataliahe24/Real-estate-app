import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../core/services/properties/property.service';
import { PropertyFilter, PropertyResponse } from '../../models/property.model';

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
  
  constructor(private propertyService: PropertyService) {}
  
  ngOnInit(): void {
    this.loadProperties();
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
}