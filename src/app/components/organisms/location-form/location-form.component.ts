import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationModel } from '../../../core/models/location.model';
import { MoleculesModule } from '../../molecules/molecules.module';
import { AtomsModule } from '../../atoms/atoms.module';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { LocationService } from '@app/core/services/locations/location.service';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent {
  @Output() submitForm = new EventEmitter<LocationModel>();
  @Output() error = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  locationForm: FormGroup;
  selectedDepartmentId: number = 0;
  disabled: boolean = false;

  readonly CITY_MIN_LENGTH = 3;
  readonly NEIGHBORHOOD_MIN_LENGTH = 3;

  neighborhoodInfo = {
    currentLength: 0,
    maxLength: 50,
    minLength: this.NEIGHBORHOOD_MIN_LENGTH,
    isValid: true,
    isDirty: false
  };

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private locationService: LocationService
  ) {
    this.locationForm = this.fb.group({
      city: ['', [Validators.required, Validators.minLength(this.CITY_MIN_LENGTH), Validators.maxLength(50)]],
      neighborhood: ['', [Validators.required, Validators.minLength(this.NEIGHBORHOOD_MIN_LENGTH), Validators.maxLength(50)]],
      department: ['']
    });
    
    // Add subscription to track neighborhood changes
    this.locationForm.get('neighborhood')?.valueChanges.subscribe(value => {
      this.neighborhoodInfo.currentLength = value?.length || 0;
      this.neighborhoodInfo.isValid = this.locationForm.get('neighborhood')?.valid || false;
      this.neighborhoodInfo.isDirty = this.locationForm.get('neighborhood')?.dirty || false;
    });
    
    console.log('Formulario inicializado:', this.locationForm.value);
  }

  createLocation(): void {
    console.log('createLocation() fue llamado');
    if (this.locationForm.invalid) {
      console.log('Formulario inválido. Estado:', {
        city: this.locationForm.get('city')?.errors,
        neighborhood: this.locationForm.get('neighborhood')?.errors,
        department: this.locationForm.get('department')?.errors,
        formValue: this.locationForm.value
      });
      this.handleValidationErrors();
      return;
    }
    const { city, neighborhood } = this.locationForm.value;
    console.log('Emitiendo submitForm con:', { city, neighborhood });
    try {
      this.submitForm.emit({
        cityName: city.trim(),
        neighborhood: neighborhood.trim()
      });
      console.log('Evento emitido exitosamente');
    } catch (error) {
      
    }
  }

  private handleValidationErrors(): void {
    const cityControl = this.locationForm.get('city');
    const neighborhoodControl = this.locationForm.get('neighborhood');

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
      } else if (neighborhoodControl.errors['minlength']) {
      }
    }
  }

  onDepartmentChange(deptId: number): void {
    this.selectedDepartmentId = Number(deptId);
    this.locationForm.get('city')?.setValue('');
  }

  onCancel(): void {
    this.cancel.emit();
    this.locationForm.reset();
    this.selectedDepartmentId = 0;
  }

  value: string = '';
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

  resetForm(): void {
    this.locationForm.reset({
      department: '',
      city: '',
      neighborhood: ''
    });
    this.selectedDepartmentId = 0;
  }
} 