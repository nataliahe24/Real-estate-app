import { Component, Output, EventEmitter, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CategoryService } from '../../../core/services/categories/category.service';
import { Category } from '../../../core/models/category.model';
import { PropertyService } from '@app/core/services/properties/property.service';
import { PropertyFilter, PropertyResponse } from '../../../core/models/property.model';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FiltersModalConfig } from '../filters-modal/filters-modal.component';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter<PropertyFilter>();
  @Input() formGroup!: FormGroup;

  searchForm: FormGroup;
  categories: Category[] = [];
  loading = true;
  error = false;
  private destroy$ = new Subject<void>();
  showFilters = false;

  roomsControl = new FormControl('');
  bathroomsControl = new FormControl('');
  minPriceControl = new FormControl('');
  maxPriceControl = new FormControl('');
  sortByControl = new FormControl('');
  categoryControl = new FormControl('');

  filtersConfig: FiltersModalConfig = {
    roomsControl: this.roomsControl,
    bathroomsControl: this.bathroomsControl,
    minPriceControl: this.minPriceControl,
    maxPriceControl: this.maxPriceControl,
    sortByControl: this.sortByControl,
    sortOptions: [
      { label: 'Precio', value: 'price' },
      { label: 'Habitaciones', value: 'rooms' },
      { label: 'Baños', value: 'bathrooms' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private propertyService: PropertyService
  ) {
    this.searchForm = this.fb.group({
      location: [''],
      category: this.categoryControl,
      rooms: [''],
      bathrooms: [''],
      minPrice: [''],
      maxPrice: [''],
      sortBy: [''],
      orderAsc: [true]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.setupFormListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFormListeners(): void {

    this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.onSearch();
      });

 
    this.roomsControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onSearch());

    this.bathroomsControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onSearch());

    this.minPriceControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onSearch());

    this.maxPriceControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onSearch());

    this.categoryControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onSearch());
  }

  loadCategories(): void {
    this.categoryService.getCategories(0, 100, true).subscribe({
      next: (response) => {
        if (response?.content) {
          this.categories = response.content;
        } else {
          this.error = true;
        }
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const formValue = this.searchForm.value;
    const filters: PropertyFilter = {
      location: formValue.location || undefined,
      category: this.categoryControl.value || undefined,
      rooms: this.roomsControl.value ? Number(this.roomsControl.value) : undefined,
      bathrooms: this.bathroomsControl.value ? Number(this.bathroomsControl.value) : undefined,
      minPrice: this.minPriceControl.value ? Number(this.minPriceControl.value) : undefined,
      maxPrice: this.maxPriceControl.value ? Number(this.maxPriceControl.value) : undefined,
      sortBy: formValue.sortBy || undefined,
      orderAsc: formValue.orderAsc
    };
    this.search.emit(filters);
  }

  onCategoryChange(category: string): void {
    this.categoryControl.setValue(category);
    this.onSearch();
  }

  resetForm(): void {
    this.searchForm.reset({ orderAsc: true });
    this.roomsControl.reset();
    this.bathroomsControl.reset();
    this.minPriceControl.reset();
    this.maxPriceControl.reset();
    this.categoryControl.reset();
    this.onSearch();
  }

  onFiltersChange(filters: {
    rooms: number | undefined;
    bathrooms: number | undefined;
    minPrice: number | undefined;
    maxPrice: number | undefined;
  }): void {
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
    this.onSearch();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}
