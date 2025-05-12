import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '../../../core/models/location.model';
import { MoleculesModule } from '../../molecules/molecules.module';
import { AtomsModule } from '../../atoms/atoms.module';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent {
  @Output() submitForm = new EventEmitter<Location>();
  @Output() error = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  locationForm: FormGroup;
  selectedDepartmentId: number = 0;

  constructor(private fb: FormBuilder) {
    this.locationForm = this.fb.group({
      city: ['', Validators.required],
      neighborhood: ['', Validators.required],
      department: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.locationForm.valid) {
      const location: Location = {
        id: 0,
        cityName: this.locationForm.get('city')?.value,
        neighborhood: this.locationForm.get('neighborhood')?.value,
        department: this.locationForm.get('department')?.value,
        address: this.locationForm.get('address')?.value
      };
      this.submitForm.emit(location);
    } else {
      this.error.emit('Por favor complete todos los campos requeridos');
    }
  }

  onDepartmentChange(event: any): void {
    this.selectedDepartmentId = Number(event.value);
    this.locationForm.get('city')?.setValue('');
  }

  onCancel(): void {
    this.cancel.emit();
  }
} 