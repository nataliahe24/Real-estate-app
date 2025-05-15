import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitySelectComponent } from './city-select.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleChange } from '@angular/core';

describe('CitySelectComponent', () => {
  let component: CitySelectComponent;
  let fixture: ComponentFixture<CitySelectComponent>;
  let httpMock: HttpTestingController;

  const mockCities = [
    { id: 1, name: 'Ciudad 1', departmentId: 1 },
    { id: 2, name: 'Ciudad 2', departmentId: 1 },
    { id: 3, name: 'Ciudad 3', departmentId: 2 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CitySelectComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CitySelectComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should clear cities when departmentId is not provided', () => {
    component.departmentId = 0;
    component.ngOnChanges({
      departmentId: new SimpleChange(null, 0, true)
    });
    expect(component.cities).toEqual([]);
  });

  it('should handle ControlValueAccessor methods', () => {
    const mockValue = 'Ciudad 1';
    const mockFn = jest.fn();

    component.writeValue(mockValue);
    expect(component.value).toBe(mockValue);

    component.registerOnChange(mockFn);
    component.onChange('new value');
    expect(mockFn).toHaveBeenCalledWith('new value');

    component.registerOnTouched(mockFn);
    component.onTouched();
    expect(mockFn).toHaveBeenCalled();

    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
  });
}); 