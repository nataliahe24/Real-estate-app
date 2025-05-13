import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationModel } from '../../../core/models/location.model';
import { MoleculesModule } from '../../molecules/molecules.module';
import { AtomsModule } from '../../atoms/atoms.module';

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

  constructor(private fb: FormBuilder) {
    this.locationForm = this.fb.group({
      cityName: ['', Validators.required],
      neighborhood: ['', Validators.required],
      department: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.locationForm.valid) {
      this.submitForm.emit(this.locationForm.value);
      this.locationForm.reset();
    } else {
      this.error.emit('Por favor complete todos los campos requeridos');
    }
  }

  onDepartmentChange(event: any): void {
    this.selectedDepartmentId = Number(event.value);
    this.locationForm.get('cityName')?.setValue('');
  }

  onCancel(): void {
    this.cancel.emit();
  }
} 