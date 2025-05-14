import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentSelectComponent } from './department-select.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('DepartmentSelectComponent', () => {
  let component: DepartmentSelectComponent;
  let fixture: ComponentFixture<DepartmentSelectComponent>;
  let httpMock: HttpTestingController;

  const mockDepartments = [
    { id: 1, name: 'Departamento 1' },
    { id: 2, name: 'Departamento 2' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepartmentSelectComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentSelectComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load departments on init', () => {
    component.ngOnInit();
    
    const req = httpMock.expectOne('assets/data/departments.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockDepartments);

    expect(component.departments).toEqual([
      { value: 1, label: 'Departamento 1' },
      { value: 2, label: 'Departamento 2' }
    ]);
  });

  it('should emit department change event', () => {
    const mockEvent = { target: { value: '1' } };
    const spy = jest.spyOn(component.departmentChange, 'emit');

    component.onValueChange(mockEvent);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should handle ControlValueAccessor methods', () => {
    const mockValue = '1';
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