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
    
  ) {
    this.locationForm = this.fb.group({
      city: ['', [Validators.required, Validators.minLength(this.CITY_MIN_LENGTH)]],
      neighborhood: ['', [Validators.required, Validators.minLength(this.NEIGHBORHOOD_MIN_LENGTH), Validators.maxLength(50)]],
      department: ['', [Validators.required]]
    });
    
    this.locationForm.get('neighborhood')?.valueChanges.subscribe(value => {
      this.neighborhoodInfo.currentLength = value?.length || 0;
      this.neighborhoodInfo.isValid = this.locationForm.get('neighborhood')?.valid || false;
      this.neighborhoodInfo.isDirty = this.locationForm.get('neighborhood')?.dirty || false;
    });
  }

  createLocation(): void {
    if (this.locationForm.invalid) {
      return;
    }
    const { city, neighborhood } = this.locationForm.value;
    try {
      this.submitForm.emit({
        cityName: city.trim(),
        neighborhood: neighborhood.trim()
      });
    } catch (error) {
      this.error.emit('Error al crear la ubicación');
    }
  }

  onDepartmentChange(deptId: number): void {
    this.selectedDepartmentId = Number(deptId);
    this.locationForm.get('city')?.setValue('');
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