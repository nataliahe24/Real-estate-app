import { Component, forwardRef, EventEmitter, Output, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-department-select',
  templateUrl: './department-select.component.html',
  styleUrls: ['./department-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DepartmentSelectComponent),
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
    this.http.get<{ id: number; name: string }[]>('assets/data/departments.json')
      .subscribe({
        next: data => {
          console.log('Departamentos cargados:', data);
          this.departments = data.map(dept => ({
            value: dept.id,
            label: dept.name
          }));
        },
        error: err => {
          console.error('Error cargando departamentos:', err);
        }
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
    const value = Number(event.target.value);
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.departmentChange.emit(value);
  }
} 