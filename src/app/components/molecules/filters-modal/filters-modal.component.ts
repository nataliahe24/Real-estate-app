import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

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
export class FiltersModalComponent {
  @Input() open = false;
  @Input() config!: FiltersModalConfig;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
} 