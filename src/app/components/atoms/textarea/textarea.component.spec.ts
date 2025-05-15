import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextareaComponent } from './textarea.component';
import { FormsModule } from '@angular/forms';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextareaComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.value).toBe('');
    expect(component.disabled).toBeFalsy();
    expect(component.placeholder).toBe('');
    expect(component.label).toBe('');
    expect(component.required).toBeFalsy();
  });

  it('should update value when input changes', () => {
    const testValue = 'Test text';
    component.updateValue(testValue);
    expect(component.value).toBe(testValue);
  });

  it('should handle disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTruthy();
  });

  it('should register onChange and onTouched functions', () => {
    const onChangeFn = jest.fn();
    const onTouchedFn = jest.fn();

    component.registerOnChange(onChangeFn);
    component.registerOnTouched(onTouchedFn);

    component.updateValue('test');
    expect(onChangeFn).toHaveBeenCalledWith('test');
  });

  it('should write value', () => {
    const testValue = 'New value';
    component.writeValue(testValue);
    expect(component.value).toBe(testValue);
  });
}); 