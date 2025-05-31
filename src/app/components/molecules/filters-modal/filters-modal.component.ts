import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

export interface FiltersModalConfig {
  roomsControl: FormControl;
  bathroomsControl: FormControl;
  minPriceControl: FormControl;
  maxPriceControl: FormControl;
  sortByControl: FormControl;
  sortOptions: { label: string; value: string }[];
}

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.scss']
})
export class FiltersModalComponent  {
  @Input() open = false;
  @Input() config!: FiltersModalConfig;
  @Output() close = new EventEmitter<void>();
  @Output() filtersChange = new EventEmitter<{
    rooms: number | undefined;
    bathrooms: number | undefined;
    minPrice: number | undefined;
    maxPrice: number | undefined;
  }>();

  private destroy$ = new Subject<void>();

  onClose(): void {
    this.close.emit();
  }

  private emitFilters(): void {
    const rooms = this.config.roomsControl.value ? Number(this.config.roomsControl.value) : undefined;
    const bathrooms = this.config.bathroomsControl.value ? Number(this.config.bathroomsControl.value) : undefined;
    const minPrice = this.config.minPriceControl.value ? Number(this.config.minPriceControl.value) : undefined;
    const maxPrice = this.config.maxPriceControl.value ? Number(this.config.maxPriceControl.value) : undefined;

    const filters = {
      rooms,
      bathrooms,
      minPrice,
      maxPrice
    };

    this.filtersChange.emit(filters);
  }

  applyFilters(): void {
    this.close.emit();
  }
} 