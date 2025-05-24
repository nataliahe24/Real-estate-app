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

  describe('Department Changes', () => {
    it('should load cities when departmentId changes', () => {
      component.departmentId = 1;
      fixture.detectChanges();
      
      component.ngOnChanges({
        departmentId: new SimpleChange(null, 1, true)
      });
      fixture.detectChanges();

      const req = httpMock.expectOne('assets/data/city.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCities);
      
      const expectedCities = mockCities
        .filter(city => city.departmentId === 1)
        .map(city => ({
          value: city.name,
          label: city.name
        }));
      
      expect(component.cities).toEqual(expectedCities);
    });

    it('should handle error when loading cities', () => {
      component.departmentId = 1;
      fixture.detectChanges();
      
      component.ngOnChanges({
        departmentId: new SimpleChange(null, 1, true)
      });
      fixture.detectChanges();

      const req = httpMock.expectOne('assets/data/city.json');
      req.error(new ErrorEvent('Network error'));
      
      expect(component.cities).toEqual([]);
    });
  });

  describe('Value Selection', () => {
    it('should handle value selection and emit changes', () => {
      const mockFn = jest.fn();
      component.registerOnChange(mockFn);
      
      component.onValueChange({ target: { value: '1' } });
      
      expect(component.value).toBe('1');
      expect(mockFn).toHaveBeenCalledWith('1');
    });

    it('should handle empty value selection', () => {
      const mockFn = jest.fn();
      component.registerOnChange(mockFn);
      
      component.onValueChange({ target: { value: '' } });
      
      expect(component.value).toBe('');
      expect(mockFn).toHaveBeenCalledWith('');
    });
  });

  describe('Disabled State', () => {
    it('should update disabled state and form control', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);

      component.setDisabledState(false);
      expect(component.disabled).toBe(false);
    });
  });
}); 