import { FormControl } from '@angular/forms';

export interface RangeConfig {
  min: number;
  max: number;
  step: number;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface FiltersModalConfig {
  roomsControl: FormControl<number | null>;
  bathroomsControl: FormControl<number | null>;
  minPriceControl: FormControl<number | null>;
  maxPriceControl: FormControl<number | null>;
  sortByControl: FormControl<string | null>;
  sortOptions: SortOption[];
  rooms: RangeConfig;
  bathrooms: RangeConfig;
  price: RangeConfig;
} 