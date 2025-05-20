import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyFormComponent } from './property-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PropertyFormComponent', () => {
  let component: PropertyFormComponent;
  let fixture: ComponentFixture<PropertyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyFormComponent],
      imports: [ReactiveFormsModule, FormsModule],
      schemas: [NO_ERRORS_SCHEMA] // avoids errors with child components like <app-input>
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the form invalid on init', () => {
    expect(component.propertyForm.valid).toBeFalsy();
  });

  it('should validate required fields correctly', () => {
    const form = component.propertyForm;
    form.patchValue({
      name: 'Casa Bonita',
      address: 'Calle 123',
      description: 'Una casa grande',
      category: 1,
      rooms: 2,
      bathrooms: 1,
      price: 300000,
      location: 1,
      activePublicationDate: new Date().toISOString().split('T')[0],
      sellerId: 3
    });
    expect(form.valid).toBeTruthy();
  });

  it('should show error if publication date is in the past', () => {
    const control = component.propertyForm.get('activePublicationDate');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    control?.setValue(yesterday.toISOString().split('T')[0]);
    expect(control?.valid).toBeFalsy();
    expect(control?.errors?.['dateInPast']).toBeTruthy();
  });

  it('should emit submitForm event when submitting a valid form', () => {
    const spy = jest.spyOn(component.submitForm, 'emit');
    component.propertyForm.patchValue({
      name: 'Casa Bonita',
      address: 'Calle 123',
      description: 'Una casa grande',
      category: 1,
      rooms: 2,
      bathrooms: 1,
      price: 300000,
      location: 1,
      activePublicationDate: new Date().toISOString().split('T')[0],
      sellerId: 3
    });

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith(component.propertyForm.value);
  });

  it('should reset form with default values when calling resetForm', () => {
    component.resetForm();
    const form = component.propertyForm;
    expect(form.get('rooms')?.value).toBe(0);
    expect(form.get('bathrooms')?.value).toBe(0);
    expect(form.get('price')?.value).toBe(0);
    expect(form.get('sellerId')?.value).toBe(3);
  });
});
