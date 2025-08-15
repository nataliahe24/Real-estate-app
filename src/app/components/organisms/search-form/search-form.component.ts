import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, forkJoin, of, catchError } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PropertyService } from '@app/core/services/properties/property.service';
import { VisitService } from '@app/core/services/visit/visit.service';
import { PropertyFilter, PropertyFilters, PropertyResponse } from '@app/core/models/property.model';
import { Visit } from '@app/core/models/visit.model';
import { FiltersModalConfig, RangeConfig } from '@app/core/models/filters-modal.model';
import { MatDialog } from '@angular/material/dialog';
import { VisitModalComponent } from '../../molecules/visit-modal/visit-modal.component';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit, OnDestroy {
  properties: PropertyResponse[] = [];
  propertyVisits: Map<number, Visit[]> = new Map();
  loading = false;
  error = false;
  viewMode: 'grid' | 'list' = 'grid';
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  orderAsc = true;
  showFilters = false;
  
  searchForm!: FormGroup;
  categoryControl = new FormControl<string>('');
  roomsControl = new FormControl<number | null>(null, [Validators.min(1)]);
  bathroomsControl = new FormControl<number | null>(null, [Validators.min(0)]);
  minPriceControl = new FormControl<number | null>(null, [Validators.min(0)]);
  maxPriceControl = new FormControl<number | null>(null, [Validators.min(0)]);
  sortByControl = new FormControl<string | null>('price');
  private destroy$ = new Subject<void>();

  activeFilters: {
    location?: string;
    category?: string;
    rooms?: string;
    bathrooms?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
  } = {};

  readonly sortOptions = [
    { label: 'Precio', value: 'price' },
    { label: 'Habitaciones', value: 'rooms' },
    { label: 'Baños', value: 'bathrooms' },
    { label: 'Categoría', value: 'category' },
    { label: 'Ubicación', value: 'location' }
  ];

  readonly filtersConfig: FiltersModalConfig = {
    roomsControl: this.roomsControl,
    bathroomsControl: this.bathroomsControl,
    minPriceControl: this.minPriceControl,
    maxPriceControl: this.maxPriceControl,
    sortByControl: this.sortByControl,
    sortOptions: this.sortOptions,
    rooms: { min: 1, max: 10, step: 1 },
    bathrooms: { min: 1, max: 5, step: 1 },
    price: { min: 0, max: 1000000000, step: 1000000 }
  };

  constructor(
    private propertyService: PropertyService,
    private visitService: VisitService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.setupFilters();
    this.loadProperties();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.searchForm = this.fb.group({
      location: [''],
      category: this.categoryControl,
      rooms: this.roomsControl,
      bathrooms: this.bathroomsControl,
      minPrice: this.minPriceControl,
      maxPrice: this.maxPriceControl,
      sortBy: ['price']
    });
  }

  private setupFilters(): void {
    Object.keys(this.searchForm.controls).forEach(key => {
      this.searchForm.get(key)?.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe((value) => {
          if (value) {
            this.activeFilters[key as keyof typeof this.activeFilters] = String(value);
          } else {
            delete this.activeFilters[key as keyof typeof this.activeFilters];
          }
          this.currentPage = 1;
          this.loadProperties();
        });
    });
  }

  onCategoryChange(categoryId: string): void {
    this.categoryControl.setValue(categoryId);
  }

  loadProperties(): void {
    this.loading = true;
    const formValue = this.searchForm.value;
    
    const filters: PropertyFilters = {
      page: this.currentPage - 1,
      size: this.pageSize,
      ...formValue,
      rooms: formValue.rooms ? Number(formValue.rooms) : undefined,
      bathrooms: formValue.bathrooms ? Number(formValue.bathrooms) : undefined,
      minPrice: formValue.minPrice ? Number(formValue.minPrice) : undefined,
      maxPrice: formValue.maxPrice ? Number(formValue.maxPrice) : undefined,
      orderAsc: this.orderAsc
    };

    this.propertyService.getFilteredProperties(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.properties = response.content || [];
          this.totalItems = response.totalElements || 0;
          
          // Cargar visitas para cada propiedad
          this.loadVisitsForProperties();
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading properties:', error);
          this.error = true;
          this.loading = false;
        }
      });
  }

  private loadVisitsForProperties(): void {
    if (this.properties.length === 0) {
      return;
    }
    
    console.log(`Loading visits for ${this.properties.length} properties`);
    
    // Usar el servicio real para obtener visitas por propiedad
    const visitRequests = this.properties.map(property => 
      this.visitService.getVisitsByProperty(property.id).pipe(
        catchError((error) => {
          console.error(`Error loading visits for property ${property.id}:`, error);
          return of([]); // Retornar array vacío en caso de error
        })
      )
    );

    forkJoin(visitRequests).subscribe({
      next: (visitsArrays: Visit[][]) => {
        this.propertyVisits.clear();
        let totalVisits = 0;
        
        visitsArrays.forEach((visits: Visit[], index: number) => {
          if (visits.length > 0) {
            console.log(`Property ${this.properties[index].id} has ${visits.length} visits`);
            this.propertyVisits.set(this.properties[index].id, visits);
            totalVisits += visits.length;
          } else {
            console.log(`Property ${this.properties[index].id} has no visits`);
          }
        });
        
        console.log(`Total visits loaded: ${totalVisits} across ${this.properties.length} properties`);
        console.log('Property visits map:', this.propertyVisits);
      },
      error: (error: any) => {
        console.error('Error loading visits for properties:', error);
        // No mostrar error al usuario, simplemente no mostrar botones de visita
      }
    });
  }

  getVisitsForProperty(propertyId: number): Visit[] {
    return this.propertyVisits.get(propertyId) || [];
  }

  openVisitModal(property: PropertyResponse): void {
    const visits = this.getVisitsForProperty(property.id);
    
    if (visits.length === 0) {
      return;
    }

    const dialogRef = this.dialog.open(VisitModalComponent, {
      data: {
        propertyId: property.id,
        propertyName: property.name,
        visits: visits
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Visita confirmada:', result);
      }
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onFiltersChange(filters: PropertyFilter): void {
    this.searchForm.patchValue(filters);
    this.currentPage = 1;
    this.loadProperties();
  }

  onViewModeChange(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  onSortChange(sortValue: string): void {
    this.searchForm.patchValue({ sortBy: sortValue });
  }

  onOrderChange(orderAsc: boolean): void {
    this.orderAsc = orderAsc;
    this.loadProperties();
  }

  removeFilter(filter: keyof typeof this.activeFilters): void {
    this.searchForm.patchValue({ [filter]: '' });
    delete this.activeFilters[filter];
    this.loadProperties();
  }

  resetForm(): void {
    this.searchForm.reset();
    this.activeFilters = {};
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