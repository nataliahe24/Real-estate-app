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
        .subscribe(() => {
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

  onFiltersApplied(filters: { rooms: number | undefined; bathrooms: number | undefined; minPrice: number | undefined; maxPrice: number | undefined }): void {
    console.log('Filters received:', filters);
    if (filters.rooms !== undefined) {
      this.roomsControl.setValue(filters.rooms.toString());
    }
    if (filters.bathrooms !== undefined) {
      this.bathroomsControl.setValue(filters.bathrooms.toString());
    }
    if (filters.minPrice !== undefined) {
      this.minPriceControl.setValue(filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      this.maxPriceControl.setValue(filters.maxPrice.toString());
    }
  }
}
