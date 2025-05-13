import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LocationService } from '../../../core/services/locations/location.service';
import { LocationResponse } from '../../../core/models/location.model';

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

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.setupSearch();
    this.loadLocations();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
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
          this.locations = response.content;
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
    this.currentPage = page;
    this.loadLocations();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
} 