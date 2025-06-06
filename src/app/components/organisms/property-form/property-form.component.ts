import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Category } from '@app/core/models/category.model';
import { Property } from '@app/core/models/property.model';
import { AuthService } from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss']
})
export class PropertyFormComponent {
  @Output() submitForm = new EventEmitter<Property>();

  propertyForm: FormGroup;
  private currentUserId: number | null;

  readonly NAME_MIN_LENGTH = 3;
  readonly NAME_MAX_LENGTH = 50;
  readonly ADDRESS_MIN_LENGTH = 3;
  readonly ADDRESS_MAX_LENGTH = 100;
  readonly DESCRIPTION_MIN_LENGTH = 3;
  readonly DESCRIPTION_MAX_LENGTH = 200;
  readonly PRICE_MIN = 0;
  readonly ROOMS_MIN = 0;
  readonly BATHROOMS_MIN = 0;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.currentUserId = this.authService.getCurrentUser()?.id ?? null;
    console.log('ID del usuario autenticado:', this.currentUserId);
    this.propertyForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(this.NAME_MAX_LENGTH),
        Validators.minLength(this.NAME_MIN_LENGTH)
      ]],
      address: ['', [
        Validators.required,
        Validators.maxLength(this.ADDRESS_MAX_LENGTH),
        Validators.minLength(this.ADDRESS_MIN_LENGTH)
      ]],
      description: ['', [
        Validators.required,
        Validators.maxLength(this.DESCRIPTION_MAX_LENGTH),
        Validators.minLength(this.DESCRIPTION_MIN_LENGTH)
      ]],
      category: ['', [Validators.required]],
      rooms: [0, [
        Validators.required,
        Validators.min(1)
      ]],
      bathrooms: [0, [
        Validators.required,
        Validators.min(1)
      ]],
      price: [0, [
        Validators.required,
        Validators.min(1)
      ]],
      location: ['', [Validators.required]],
      activePublicationDate: ['', [
        Validators.required,
        this.dateNotInPastValidator()
      ]],
      sellerId: [this.currentUserId, [Validators.required]]
    });
  }

  private dateNotInPastValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return { dateInPast: true };
      }

      const oneMonthFromToday = new Date();
      oneMonthFromToday.setMonth(oneMonthFromToday.getMonth() + 1);
      oneMonthFromToday.setHours(0, 0, 0, 0);

      if (selectedDate > oneMonthFromToday) {
        return { dateExceedsMonth: true };
      }

      return null;
    };
  }

  get activePublicationDateInfo() {
    const control = this.propertyForm.get('activePublicationDate');
    return {
      isValid: control?.valid,
      isDirty: control?.dirty,
      hasError: control?.errors?.['dateInPast'],
      hasDateExceedsMonth: control?.errors?.['dateExceedsMonth']
    };
  }

  onSubmit(): void {
    if (this.propertyForm.valid) {
      this.submitForm.emit(this.propertyForm.value);
    }
  }

  onCancel(): void {
    this.propertyForm.reset();
  }

  categoryIdSelected(id: number | null) {
    this.propertyForm.get('category')?.setValue(id);
  }

  locationSelected(locationId: number | null) {
    this.propertyForm.get('location')?.setValue(locationId || '');
  }

  resetForm(): void {
    this.currentUserId = this.authService.getCurrentUser()?.id ?? null;
    this.propertyForm.reset();
    this.propertyForm.patchValue({
      name: '',
      address: '',
      description: '',
      rooms: 0,
      bathrooms: 0,
      price: 0,
      location: '',
      category: '',
      activePublicationDate: new Date().toISOString().split('T')[0],
      sellerId: this.currentUserId
    });
  }
} 