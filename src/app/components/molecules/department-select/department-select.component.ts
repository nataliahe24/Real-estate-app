import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-department-select',
  templateUrl: './department-select.component.html',
  styleUrls: ['./department-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DepartmentSelectComponent,
      multi: true
    }
  ]
})
export class DepartmentSelectComponent implements ControlValueAccessor, OnInit {
  @Output() departmentChange = new EventEmitter<number>();
  
  departments: { value: number; label: string }[] = [];
  value: any;
  disabled: boolean = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  private loadDepartments(): void {
    this.http.get<any[]>('assets/data/departments.json')
      .subscribe(data => {
        this.departments = data.map(dept => ({
          value: dept.id,
          label: dept.name
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
    this.departmentChange.emit(Number(this.value));
  }
} 