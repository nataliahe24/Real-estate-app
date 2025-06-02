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
  
  // Filtros activos
  activeFilters: PropertyFilter = {};
  
  // Formulario principal
  searchForm: FormGroup;
  
  // Controles de formulario
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
        .subscribe(() => {
          this.updateActiveFilters();
          this.currentPage = 1;
          this.loadProperties();
        });
    });
  }

  updateActiveFilters(): void {
    this.activeFilters = {
      location: this.searchControl.value || undefined,
      category: this.categoryControl.value || undefined,
      rooms: this.roomsControl.value ? Number(this.roomsControl.value) : undefined,
      bathrooms: this.bathroomsControl.value ? Number(this.bathroomsControl.value) : undefined,
      minPrice: this.minPriceControl.value ? Number(this.minPriceControl.value) : undefined,
      maxPrice: this.maxPriceControl.value ? Number(this.maxPriceControl.value) : undefined,
      sortBy: this.sortByControl.value || 'price',
      orderAsc: this.orderAsc
    };
    
  }

  loadProperties(): void {
    this.loading = true;
    const filters: PropertyFilters = {
      page: this.currentPage - 1,
      size: this.pageSize,
      ...this.activeFilters
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
    this.activeFilters = { ...filters };
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
  
  get totalCount(): number {
    return this.totalItems;
  }

  hasActiveFilters(): boolean {
    return Object.keys(this.activeFilters).length > 0;
  }

  removeFilter(filter: 'rooms' | 'bathrooms' | 'minPrice' | 'maxPrice' | 'location' | 'category'): void {
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
      case 'location':
        this.searchControl.setValue('');
        break;
      case 'category':
        this.categoryControl.setValue('');
        break;
    }
    
    delete this.activeFilters[filter];
    this.currentPage = 1;
    
    this.loadProperties();
  }
}