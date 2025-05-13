import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationModel } from '../../../core/models/location.model';
import { MoleculesModule } from '../../molecules/molecules.module';
import { AtomsModule } from '../../atoms/atoms.module';
import { NotificationService } from '@app/core/services/notifications/notification.service';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent {
  @Output() submitForm = new EventEmitter<{ cityName: string; neighborhood: string }>();
  @Output() error = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  locationForm: FormGroup;
  selectedDepartmentId: number = 0;

  readonly CITY_MIN_LENGTH = 3;
  readonly NEIGHBORHOOD_MIN_LENGTH = 3;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.locationForm = this.fb.group({
      cityName: ['', [Validators.required, Validators.minLength(this.CITY_MIN_LENGTH)]],
      neighborhood: ['', [Validators.required, Validators.minLength(this.NEIGHBORHOOD_MIN_LENGTH)]],
      department: [''],
    });
  }

  createLocation(): void {
    if (this.locationForm.invalid) {
      const cityControl = this.locationForm.get('cityName');
      const neighborhoodControl = this.locationForm.get('neighborhood');
      const departmentControl = this.locationForm.get('department');

      if (cityControl?.errors) {
        if (cityControl.errors['required']) {
          this.notificationService.warning('La ciudad es requerida');
        } else if (cityControl.errors['minlength']) {
          this.notificationService.warning(
            `La ciudad debe tener al menos ${this.CITY_MIN_LENGTH} caracteres`
          );
        }
      }

      if (neighborhoodControl?.errors) {
        if (neighborhoodControl.errors['required']) {
          this.notificationService.warning('El barrio es requerido');
        } else if (neighborhoodControl.errors['minlength']) {
          this.notificationService.warning(
            `El barrio debe tener al menos ${this.NEIGHBORHOOD_MIN_LENGTH} caracteres`
          );
        }
      }

      if (departmentControl?.errors?.['required']) {
        this.notificationService.warning('El departamento es requerido');
      }
      return;
    }

    const { cityName, neighborhood } = this.locationForm.value;
    this.submitForm.emit({ cityName, neighborhood });
    this.locationForm.reset();
  }

  onDepartmentChange(deptId: number): void {
    this.selectedDepartmentId = Number(deptId);
    this.locationForm.get('cityName')?.setValue('');
  }

  onCancel(): void {
    this.cancel.emit();
  }
  value: string = '';
  disabled: boolean = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: string): void {
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