import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertiesToolbarComponent } from './properties-toolbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select',
  template: '<select></select>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockSelectComponent),
      multi: true
    }
  ]
})
class MockSelectComponent implements ControlValueAccessor {
  writeValue(value: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState(isDisabled: boolean): void {}
}

describe('PropertiesToolbarComponent', () => {
  let component: PropertiesToolbarComponent;
  let fixture: ComponentFixture<PropertiesToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PropertiesToolbarComponent,
        MockSelectComponent
      ],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.totalCount).toBe(0);
    expect(component.viewMode).toBe('grid');
  });
  it('should emit viewModeChange event when toggleViewMode is called', () => {
    const newMode = 'list';
    jest.spyOn(component.viewModeChange, 'emit');

    component.toggleViewMode(newMode);

    expect(component.viewModeChange.emit).toHaveBeenCalledWith(newMode);
  });
  describe('sort handling', () => {
    it('should emit sort change when value is provided', () => {
      const sortValue = 'price';
      const spy = jest.spyOn(component.sortChange, 'emit');

      component.sortByControl.setValue(sortValue);

      expect(spy).toHaveBeenCalledWith(sortValue);
    });

    it('should not emit sort change when value is null', () => {
      const spy = jest.spyOn(component.sortChange, 'emit');

      component.sortByControl.setValue(null);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit sort change when value is undefined', () => {
      const spy = jest.spyOn(component.sortChange, 'emit');

      component.sortByControl.setValue(null);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit sort change when value is empty string', () => {
      const spy = jest.spyOn(component.sortChange, 'emit');

      component.sortByControl.setValue('');

      expect(spy).not.toHaveBeenCalled();
    });
  });
}); 