import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectComponent],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should set default values', () => {
      expect(component.disabled).toBeFalsy();
      expect(component.options).toEqual([]);
      expect(component.placeholder).toBe('');
      expect(component.required).toBeFalsy();
      expect(component.label).toBe('');
      expect(component.id).toBe('');
    });

    it('should accept input values', () => {
      const options = [{ value: 1, label: 'Option 1' }];
      component.options = options;
      component.placeholder = 'Select an option';
      component.required = true;
      component.label = 'Test Label';
      component.id = 'test-id';

      fixture.detectChanges();

      expect(component.options).toEqual(options);
      expect(component.placeholder).toBe('Select an option');
      expect(component.required).toBeTruthy();
      expect(component.label).toBe('Test Label');
      expect(component.id).toBe('test-id');
    });
  });

  describe('ControlValueAccessor', () => {
    it('should implement writeValue', () => {
      const testValue = 'test';
      component.writeValue(testValue);
      expect(component.value).toBe(testValue);
    });

    it('should implement registerOnChange', () => {
      const testFn = jest.fn();
      component.registerOnChange(testFn);
      expect(component.onChange).toBe(testFn);
    });

    it('should implement registerOnTouched', () => {
      const testFn = jest.fn();
      component.registerOnTouched(testFn);
      expect(component.onTouched).toBe(testFn);
    });

    it('should implement setDisabledState', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBeTruthy();
    });
  });

  describe('Value Changes', () => {
    it('should handle value changes', () => {
      const onChangeSpy = jest.spyOn(component, 'onChange');
      const onTouchedSpy = jest.spyOn(component, 'onTouched');
      const testValue = 'new value';

      component.onValueChange({ target: { value: testValue } });

      expect(component.value).toBe(testValue);
      expect(onChangeSpy).toHaveBeenCalledWith(testValue);
      expect(onTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('Template Integration', () => {
    it('should render select element with correct attributes', () => {
      component.id = 'test-select';
      component.required = true;
      component.disabled = true;
      component.placeholder = 'Select...';
      component.options = [
        { value: 1, label: 'Option 1' },
        { value: 2, label: 'Option 2' }
      ];

      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');
      const placeholderOption = select.querySelector('option[disabled]');

      expect(select.id).toBe('test-select');
      expect(select.required).toBeTruthy();
      expect(select.disabled).toBeTruthy();
      expect(placeholderOption.textContent.trim()).toBe('Select...');
      expect(select.options.length).toBe(3); 
    });
  });
}); 