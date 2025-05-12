import { Component, forwardRef, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DepartmentService } from '../../../core/services/locations/department.service';

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
export class DepartmentSelectComponent implements ControlValueAccessor {
  @Output() departmentChange = new EventEmitter<number>();
  
  departments: { value: number; label: string }[] = [];
  value: any;
  disabled: boolean = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private departmentService: DepartmentService) {
    this.loadDepartments();
  }

  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (data) => {
        this.departments = data.map(dept => ({
          value: dept.id,
          label: dept.name
        }));
      }
    );
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