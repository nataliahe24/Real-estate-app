import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyFormComponent } from './property-form.component';
import { ReactiveFormsModule, FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { NO_ERRORS_SCHEMA, Component, Input, forwardRef } from '@angular/core';
import { MOCK_PROPERTY_PUBLISHED } from '@app/shared/utils/mocks/mock-properties';
import { jest } from '@jest/globals';

@Component({
  selector: 'app-input',
  template: '<input [formControl]="control">',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockInputComponent),
      multi: true
    }
  ]
})
class MockInputComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() id: string = '';
  @Input() formControlName: string = '';
  @Input() control: FormControl = new FormControl();

  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(value: any): void {
    this.control.setValue(value);
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }
}

@Component({
  selector: 'app-textarea',
  template: '<textarea [formControl]="control"></textarea>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockTextareaComponent),
      multi: true
    }
  ]
})
class MockTextareaComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() formControlName: string = '';
  @Input() control: FormControl = new FormControl();

  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(value: any): void {
    this.control.setValue(value);
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }
}

@Component({
  selector: 'app-category-select',
  template: '<select [formControl]="control"></select>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockCategorySelectComponent),
      multi: true
    }
  ]
})
class MockCategorySelectComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() formControlName: string = '';
  @Input() control: FormControl = new FormControl();

  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(value: any): void {
    this.control.setValue(value);
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }
}

@Component({
  selector: 'app-location-select',
  template: '<select [formControl]="control"></select>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockLocationSelectComponent),
      multi: true
    }
  ]
})
class MockLocationSelectComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() formControlName: string = '';
  @Input() control: FormControl = new FormControl();

  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(value: any): void {
    this.control.setValue(value);
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }
}

@Component({
  selector: 'app-button',
  template: '<button [disabled]="disabled">{{label}}</button>'
})
class MockButtonComponent {
  @Input() type: string = '';
  @Input() disabled: boolean = false;
  @Input() label: string = '';
  @Input() isSubmit: boolean = false;
}

describe('PropertyFormComponent', () => {
  let component: PropertyFormComponent;
  let fixture: ComponentFixture<PropertyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PropertyFormComponent,
        MockInputComponent,
        MockTextareaComponent,
        MockCategorySelectComponent,
        MockLocationSelectComponent,
        MockButtonComponent
      ],
      imports: [ReactiveFormsModule, FormsModule],
      schemas: [NO_ERRORS_SCHEMA]
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

  it('should show error if publication date is in the past', () => {
    const control = component.propertyForm.get('activePublicationDate');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    control?.setValue(yesterday.toISOString().split('T')[0]);
    expect(control?.valid).toBeFalsy();
    expect(control?.errors?.['dateInPast']).toBeTruthy();
  });

  it('should reset form with default values when calling resetForm', () => {
    component.resetForm();
    const form = component.propertyForm;
    expect(form.get('rooms')?.value).toBe(0);
    expect(form.get('bathrooms')?.value).toBe(0);
    expect(form.get('price')?.value).toBe(0);
    expect(form.get('sellerId')?.value).toBe(3);
  });

  describe('form validation', () => {
    it('should validate required fields', () => {
      const form = component.propertyForm;
      expect(form.valid).toBeFalsy();
      
      form.patchValue(MOCK_PROPERTY_PUBLISHED);
      expect(form.valid).toBeTruthy();
    });

    it('should validate price is greater than 0', () => {
      const form = component.propertyForm;
      form.patchValue({ ...MOCK_PROPERTY_PUBLISHED, price: -1 });
      expect(form.get('price')?.errors?.['min']).toBeTruthy();
    });
  });

  describe('form submission', () => {
    it('should emit property data when form is valid', () => {
      const form = component.propertyForm;
      form.patchValue(MOCK_PROPERTY_PUBLISHED);
      
      jest.spyOn(component.submitForm, 'emit');
      component.onSubmit();
      
      expect(component.submitForm.emit).toHaveBeenCalledWith(form.value);
    });

    it('should not emit when form is invalid', () => {
      const form = component.propertyForm;
      form.patchValue({ ...MOCK_PROPERTY_PUBLISHED, name: '' });
      
      jest.spyOn(component.submitForm, 'emit');
      component.onSubmit();
      
      expect(component.submitForm.emit).not.toHaveBeenCalled();
    });
  });

  describe('form reset', () => {
    it('should reset form to initial state', () => {
      const form = component.propertyForm;
      form.patchValue(MOCK_PROPERTY_PUBLISHED);
      
      component.resetForm();
      
      expect(form.value).toEqual({
        name: null,
        description: null,
        price: 0,
        category: null,
        location: null,
        address: null,
        rooms: 0,
        bathrooms: 0,
        activePublicationDate: new Date().toISOString().split('T')[0],
        sellerId: 3
      });
    });
  });
});
