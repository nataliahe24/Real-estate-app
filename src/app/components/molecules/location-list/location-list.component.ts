import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { LocationService } from '../../../core/services/locations/location.service';
import { LocationResponse } from '../../../core/models/location.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {
  locations: LocationResponse[] = [];
  searchControl = new FormControl('');
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  loading = false;
  orderAsc = true;
  private destroy$ = new Subject<void>();
  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.setupSearch();
    this.loadLocations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadLocations();
      });
  }

  onSearchClick(): void {
    this.currentPage = 1;
    this.loadLocations();
  }

  onOrderChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.orderAsc = value === 'asc';
    this.currentPage = 1;
    this.loadLocations();
  }

  loadLocations(): void {
    this.loading = true;
    const searchText = this.searchControl.value || '';
    
    this.locationService
      .findByCityOrDepartment(
        searchText,
        this.currentPage - 1,
        this.itemsPerPage,
        this.orderAsc
      )
      .subscribe({
        next: (response: { content: LocationResponse[]; totalElements: number }) => {
          this.locations = response.content.sort((a, b) => {
            const cityA = a.cityName.toLowerCase();
            const cityB = b.cityName.toLowerCase();
            if (cityA < cityB) return this.orderAsc ? -1 : 1;
            if (cityA > cityB) return this.orderAsc ? 1 : -1;
            return 0;
          });
          this.totalItems = response.totalElements;
          this.loading = false;
        },
        error: (error: Error) => {
          console.error('Error loading locations:', error);
          this.loading = false;
        }
      });
  }

  onPageChange(page: number): void {
    if (page === this.currentPage) return;
    this.currentPage = page;
    this.loadLocations();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  toggleOrder(): void {
    this.orderAsc = !this.orderAsc;
    this.currentPage = 1;
    this.loadLocations();
  }
} 