import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PropertyService } from '@core/services/properties/property.service';
import { PropertyResponse, PropertyFilters, Property, PropertyFilter } from '@core/models/property.model';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit, OnDestroy {
  properties: PropertyResponse[] = [];
  loading = false;
  isReset = false; 
  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  roomsControl = new FormControl('');
  bathroomsControl = new FormControl('');
  minPriceControl = new FormControl('');
  maxPriceControl = new FormControl('');
  sortByControl = new FormControl('');
  orderAsc = true;
  showFilters = false;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  private destroy$ = new Subject<void>();
  currentFilter: PropertyFilter = {};
  activeFilters: {
    rooms?: string;
    bathrooms?: string;
    minPrice?: string;
    maxPrice?: string;
  } = {};

  sortOptions = [
    { label: 'Precio', value: 'price' },
    { label: 'Habitaciones', value: 'rooms' },
    { label: 'Baños', value: 'bathrooms' },
    { label: 'Categoría', value: 'category' },
    { label: 'Ubicación', value: 'location' }
  ];

  constructor(private propertyService: PropertyService) {}

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
          if (control === this.roomsControl && value) {
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
      sortBy: this.sortByControl.value === 'location' || this.sortByControl.value === 'category' 
        ? 'id' 
        : (this.sortByControl.value || 'price'),
      orderAsc: this.orderAsc
    };

    console.log('Requesting properties with filters:', filters);

    this.propertyService.getFilteredProperties(filters).subscribe({
      next: (response: any) => {
        this.properties = response.content || [];
        this.totalItems = response.totalElements || 0;
        
        if (this.sortByControl.value === 'location' || this.sortByControl.value === 'category') {
          this.properties.sort((a, b) => {
            let valueA: string;
            let valueB: string;
            
            if (this.sortByControl.value === 'location') {
              valueA = `${a.city} ${a.neighborhood}`.toLowerCase();
              valueB = `${b.city} ${b.neighborhood}`.toLowerCase();
            } else {
              valueA = a.category.toLowerCase();
              valueB = b.category.toLowerCase();
            }
            
            if (valueA < valueB) return this.orderAsc ? -1 : 1;
            if (valueA > valueB) return this.orderAsc ? 1 : -1;
            return 0;
          });
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.loading = false;
      }
    });
  }

  onCategoryChange(category: string): void {
    this.categoryControl.setValue(category);
  }

  onPageChange(page: number): void {
    if (page === this.currentPage) return;
    this.currentPage = page;
    this.loadProperties();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  toggleOrder(): void {
    this.orderAsc = !this.orderAsc;
    this.currentPage = 1;
    this.loadProperties();
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.categoryControl.setValue('');
    this.isReset = true;
    this.roomsControl.setValue('');
    this.bathroomsControl.setValue('');
    this.minPriceControl.setValue('');
    this.maxPriceControl.setValue('');
    this.sortByControl.setValue('');
    this.orderAsc = true;
    this.currentPage = 1;
    this.activeFilters = {};
    this.loadProperties();
  }

  onFiltersApplied(filters: { rooms: number | undefined; bathrooms: number | undefined; minPrice: number | undefined; maxPrice: number | undefined }): void {
    console.log('Filters received:', filters);
    this.activeFilters = {};
    
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
    console.log('Active filters:', this.activeFilters);
  }

  hasActiveFilters(): boolean {
    return Object.keys(this.activeFilters).length > 0;
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
}
