import { Component, Input, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-city-select',
  templateUrl: './city-select.component.html',
  styleUrls: ['./city-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CitySelectComponent),
      multi: true
    }
  ]
})
export class CitySelectComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() departmentId!: number;
  
  cities: { value: number; label: string }[] = [];
  value: any;
  disabled: boolean = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCities();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['departmentId'] && !changes['departmentId'].firstChange) {
      this.loadCities();
    }
  }

  private loadCities(): void {
    if (!this.departmentId) {
      this.cities = [];
      return;
    }
    this.http.get<{ id: number; name: string; departmentId: number }[]>('assets/data/city.json')
      .subscribe(data => {
        this.cities = data
          .filter(city => city.departmentId === this.departmentId)
          .map(city => ({
            value: city.id,
            label: city.name
          }));
      });
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(event: any): void {
    this.value = event.target.value;
    this.onChange(this.value);
    this.onTouched();
  }
} 