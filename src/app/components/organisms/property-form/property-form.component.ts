import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Property } from '@app/core/models/property.model';

@Component({
  selector: 'app-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss']
})
export class PropertyFormComponent {
  @Output() submitForm = new EventEmitter<Property>();

  propertyForm: FormGroup;

  readonly NAME_MIN_LENGTH = 3;
  readonly NAME_MAX_LENGTH = 100;
  readonly ADDRESS_MIN_LENGTH = 3;
  readonly ADDRESS_MAX_LENGTH = 200;
  readonly DESCRIPTION_MIN_LENGTH = 3;
  readonly DESCRIPTION_MAX_LENGTH = 500;
  readonly PRICE_MIN = 0;
  readonly ROOMS_MIN = 0;
  readonly BATHROOMS_MIN = 0;

  constructor(private fb: FormBuilder) {
    this.propertyForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(this.NAME_MAX_LENGTH)
      ]],
      address: ['', [
        Validators.required,
        Validators.maxLength(this.ADDRESS_MAX_LENGTH)
      ]],
      description: ['', [
        Validators.required,
        Validators.maxLength(this.DESCRIPTION_MAX_LENGTH)
      ]],
      category: ['', [Validators.required]],
      rooms: [0, [
        Validators.required,
        Validators.min(this.ROOMS_MIN)
      ]],
      bathrooms: [0, [
        Validators.required,
        Validators.min(this.BATHROOMS_MIN)
      ]],
      price: [0, [
        Validators.required,
        Validators.min(this.PRICE_MIN)
      ]],
      location: ['', [Validators.required]],
      activePublicationDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      sellerId: [null, [Validators.required]]
    });
  }

  get nameInfo() {
    const control = this.propertyForm.get('name');
    return {
      currentLength: control?.value?.length || 0,
      remainingChars: this.NAME_MAX_LENGTH - (control?.value?.length || 0),
      isValid: control?.valid,
      isDirty: control?.dirty
    };
  }

  get addressInfo() {
    const control = this.propertyForm.get('address');
    return {
      currentLength: control?.value?.length || 0,
      remainingChars: this.ADDRESS_MAX_LENGTH - (control?.value?.length || 0),
      isValid: control?.valid,
      isDirty: control?.dirty
    };
  }

  get descriptionInfo() {
    const control = this.propertyForm.get('description');
    return {
      currentLength: control?.value?.length || 0,
      remainingChars: this.DESCRIPTION_MAX_LENGTH - (control?.value?.length || 0),
      isValid: control?.valid,
      isDirty: control?.dirty
    };
  }

  onSubmit(): void {
    console.log('Formulario:', this.propertyForm.value);
    if (this.propertyForm.valid) {
      this.submitForm.emit(this.propertyForm.value);
    }
  }

  onCancel(): void {
    this.propertyForm.reset();
  }
} 