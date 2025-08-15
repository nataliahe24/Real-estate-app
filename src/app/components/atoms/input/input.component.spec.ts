import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { FormsModule } from '@angular/forms';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.value).toBe('');
    expect(component.disabled).toBe(false);
    expect(component.placeholder).toBe('');
    expect(component.type).toBe('text');
    expect(component.label).toBe('');
    expect(component.maxLength).toBeNull();
    expect(component.required).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(component.class).toBe('');
    expect(component.autocomplete).toBe('off');
  });

  it('should implement ControlValueAccessor methods', () => {
    const mockFn = jest.fn();
    
    component.registerOnChange(mockFn);
    component.registerOnTouched(mockFn);
    
    expect(component.onChange).toBe(mockFn);
    expect(component.onTouched).toBe(mockFn);
  });

  it('should update value and trigger callbacks', () => {
    const mockOnChange = jest.fn();
    const mockOnTouched = jest.fn();
    const testValue = 'test value';

    component.registerOnChange(mockOnChange);
    component.registerOnTouched(mockOnTouched);
    
    component.updateValue(testValue);
    
    expect(component.value).toBe(testValue);
    expect(mockOnChange).toHaveBeenCalledWith(testValue);
    expect(mockOnTouched).toHaveBeenCalled();
  });

  it('should write value', () => {
    const testValue = 'test value';
    component.writeValue(testValue);
    expect(component.value).toBe(testValue);
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
  });

  it('should emit input event', () => {
    const mockEvent = new Event('input');
    const spy = jest.spyOn(component.input, 'emit');
    
    component.input.emit(mockEvent);
    
    expect(spy).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit focus event', () => {
    const mockEvent = new Event('focus');
    const spy = jest.spyOn(component.focus, 'emit');
    
    component.focus.emit(mockEvent);
    
    expect(spy).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit blur event', () => {
    const mockEvent = new Event('blur');
    const spy = jest.spyOn(component.blur, 'emit');
    
    component.blur.emit(mockEvent);
    
    expect(spy).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit ngModelChange event', () => {
    const testValue = 'test value';
    const spy = jest.spyOn(component.ngModelChange, 'emit');
    
    component.ngModelChange.emit(testValue);
    
    expect(spy).toHaveBeenCalledWith(testValue);
  });
}); 