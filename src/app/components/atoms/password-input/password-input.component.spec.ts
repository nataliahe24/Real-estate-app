import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordInputComponent } from './password-input.component';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('PasswordInputComponent', () => {
  let component: PasswordInputComponent;
  let fixture: ComponentFixture<PasswordInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordInputComponent],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and placeholder', () => {
    component.label = 'Clave';
    component.placeholder = 'Escribe tu clave';
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');
    const input = fixture.nativeElement.querySelector('input');
    expect(label.textContent).toContain('Clave');
    expect(input.placeholder).toBe('Escribe tu clave');
  });

  it('should toggle password visibility', () => {
    const btn = fixture.debugElement.query(By.css('.toggle-btn'));
    const input = fixture.nativeElement.querySelector('input');
    expect(input.type).toBe('password');

    btn.nativeElement.click();
    fixture.detectChanges();
    expect(component.show).toBeTruthy();
    expect(input.type).toBe('text');

    btn.nativeElement.click();
    fixture.detectChanges();
    expect(component.show).toBeFalsy();
    expect(input.type).toBe('password');
  });

  it('should call onChange and onTouched on input', () => {
    const onChangeSpy = jest.fn();
    const onTouchedSpy = jest.fn();
    component.registerOnChange(onChangeSpy);
    component.registerOnTouched(onTouchedSpy);

    const input = fixture.nativeElement.querySelector('input');
    input.value = 'secret';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value).toBe('secret');
    expect(onChangeSpy).toHaveBeenCalledWith('secret');
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBeTruthy();
  });

  it('should show required indicator if required', () => {
    component.required = true;
    component.label = 'Contraseña';
    fixture.detectChanges();
    const required = fixture.nativeElement.querySelector('.required');
    expect(required).toBeTruthy();
    expect(required.textContent).toContain('*');
  });

  it('should apply custom ngClass', () => {
    component.ngClass = 'input-error';
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.classList.contains('input-error')).toBeTruthy();
  });

  it('should work with writeValue', () => {
    component.writeValue('mipass');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('mipass');
  });
}); 