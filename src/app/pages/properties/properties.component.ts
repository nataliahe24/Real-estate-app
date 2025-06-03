import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PropertyService } from '../../core/services/properties/property.service';
import { PropertyFilter, PropertyFilters, PropertyResponse } from '../../core/models/property.model';
import { CategoryService } from '../../core/services/categories/category.service';
import { Category } from '../../core/models/category.model';

interface PaginatedPropertiesResponse {
  content: PropertyResponse[];
  totalElements: number;
}

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit, OnDestroy {
  properties: PropertyResponse[] = [];
  loading = false;
  error = false;
  viewMode: 'grid' | 'list' = 'grid';
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  private destroy$ = new Subject<void>();
  
  activeFilters: {
    location?: string;
    category?: string;
    rooms?: string;
    bathrooms?: string;
    minPrice?: string;
    maxPrice?: string;
  } = {};
  
  
  searchForm: FormGroup;
  

  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  roomsControl = new FormControl('');
  bathroomsControl = new FormControl('');
  minPriceControl = new FormControl('');
  maxPriceControl = new FormControl('');
  sortByControl = new FormControl('price');
  orderAsc = true;

  propertyImages = [
    'assets/images/casa-1.png',
    'assets/images/casa-2.png',
    'assets/images/casa-3.png',
    'assets/images/casa-4.png',
    'assets/images/casa-5.png',
    'assets/images/casa-6.png'
  ];

  sortOptions = [
    { label: 'Precio', value: 'price' },
    { label: 'Habitaciones', value: 'rooms' },
    { label: 'Baños', value: 'bathrooms' },
    { label: 'Categoría', value: 'category' },
    { label: 'Ubicación', value: 'location' }
  ];

  constructor(private propertyService: PropertyService) {
    this.searchForm = new FormGroup({
      location: this.searchControl,
      category: this.categoryControl,
      rooms: this.roomsControl,
      bathrooms: this.bathroomsControl,
      minPrice: this.minPriceControl,
      maxPrice: this.maxPriceControl,
      sortBy: this.sortByControl
    });
  }

  ngOnInit(): void {
    this.setupFilters();
    this.loadProperties();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupFilters(): void {
    const controls = [
      this.searchControl,
      this.categoryControl,
      this.roomsControl,
      this.bathroomsControl,
      this.minPriceControl,
      this.maxPriceControl,
      this.sortByControl
    ];

    controls.forEach(control => {
      control.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe((value) => {
          if (control === this.searchControl && value) {
            this.activeFilters.location = value;
          } else if (control === this.categoryControl && value) {
            this.activeFilters.category = value;
          } else if (control === this.roomsControl && value) {
            this.activeFilters.rooms = value.toString();
          } else if (control === this.bathroomsControl && value) {
            this.activeFilters.bathrooms = value.toString();
          } else if (control === this.minPriceControl && value) {
            this.activeFilters.minPrice = value.toString();
          } else if (control === this.maxPriceControl && value) {
            this.activeFilters.maxPrice = value.toString();
          }
          
          this.currentPage = 1;
          this.loadProperties();
        });
    });
  }

  loadProperties(): void {
    this.loading = true;
    const filters: PropertyFilters = {
      page: this.currentPage - 1,
      size: this.pageSize,
      location: this.searchControl.value || undefined,
      category: this.categoryControl.value || undefined,
      rooms: this.roomsControl.value ? Number(this.roomsControl.value) : undefined,
      bathrooms: this.bathroomsControl.value ? Number(this.bathroomsControl.value) : undefined,
      minPrice: this.minPriceControl.value ? Number(this.minPriceControl.value) : undefined,
      maxPrice: this.maxPriceControl.value ? Number(this.maxPriceControl.value) : undefined,
      sortBy: this.sortByControl.value || 'price',
      orderAsc: this.orderAsc
    };

    this.propertyService.getFilteredProperties(filters).subscribe({
      next: (response) => {
        this.properties = response.content || [];
        this.totalItems = response.totalElements || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  onSearch(filters: PropertyFilter): void {
  
    this.searchControl.setValue(filters.location || null);
    this.categoryControl.setValue(filters.category || null);
    if (filters.rooms !== undefined) {
      this.roomsControl.setValue(filters.rooms.toString());
      this.activeFilters.rooms = filters.rooms.toString();
    }
    if (filters.bathrooms !== undefined) {
      this.bathroomsControl.setValue(filters.bathrooms.toString());
      this.activeFilters.bathrooms = filters.bathrooms.toString();
    }
    if (filters.minPrice !== undefined) {
      this.minPriceControl.setValue(filters.minPrice.toString());
      this.activeFilters.minPrice = filters.minPrice.toString();
    }
    if (filters.maxPrice !== undefined) {
      this.maxPriceControl.setValue(filters.maxPrice.toString());
      this.activeFilters.maxPrice = filters.maxPrice.toString();
    }
    
    this.currentPage = 1;
    this.loadProperties();
  }

  onViewModeChange(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  onSortChange(sortValue: string): void {
    this.sortByControl.setValue(sortValue);
  }

  onOrderChange(orderAsc: boolean): void {
    this.orderAsc = orderAsc;
    this.loadProperties();
  }

  removeFilter(filter: 'rooms' | 'bathrooms' | 'minPrice' | 'maxPrice'): void {
    switch (filter) {
      case 'rooms':
        this.roomsControl.setValue('');
        break;
      case 'bathrooms':
        this.bathroomsControl.setValue('');
        break;
      case 'minPrice':
        this.minPriceControl.setValue('');
        break;
      case 'maxPrice':
        this.maxPriceControl.setValue('');
        break;
    }
    delete this.activeFilters[filter];
    this.currentPage = 1;
    this.loadProperties();
  }

  hasActiveFilters(): boolean {
    return Object.keys(this.activeFilters).length > 0;
  }

  get totalCount(): number {
    return this.totalItems;
  }
}