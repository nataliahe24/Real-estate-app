import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitListComponent } from './visit-list.component';
import { FormBuilder, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { VisitService } from '@core/services/visit/visit.service';
import { of, throwError } from 'rxjs';
import { Visit } from '@core/models/visit.model';
import { NO_ERRORS_SCHEMA, Component, Input, forwardRef } from '@angular/core';
import { By } from '@angular/platform-browser';

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
  @Input() placeholder: string = '';
  @Input() formControlName: string = '';
  control: FormControl = new FormControl();
  
  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(value: any): void {
    this.control.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }
}

@Component({
  selector: 'app-button',
  template: '<button>{{label}}</button>'
})
class MockButtonComponent {
  @Input() label: string = '';
  @Input() type: string = 'primary';
  @Input() isSubmit: boolean = false;
  @Input() disabled: boolean = false;
}

describe('VisitListComponent', () => {
  let component: VisitListComponent;
  let fixture: ComponentFixture<VisitListComponent>;
  let visitServiceMock: jest.Mocked<VisitService>;

  const mockVisits: Visit[] = [
    {
      id: 1,
      propertyName: 'Casa Test 1',
      city: 'Ciudad Test',
      neighborhood: 'Barrio Test',
      address: 'Dirección Test 1',
      startDate: '2024-03-20T10:00:00',
      endDate: '2024-03-20T11:00:00',
      sellerId: 1,
      propertyId: 1
    },
    {
      id: 2,
      propertyName: 'Casa Test 2',
      city: 'Ciudad Test',
      neighborhood: 'Barrio Test',
      address: 'Dirección Test 2',
      startDate: '2024-03-21T10:00:00',
      endDate: '2024-03-21T11:00:00',
      sellerId: 2,
      propertyId: 2
    }
  ];

  const mockResponse = {
    content: mockVisits,
    totalPages: 2,
    totalElements: 2,
    size: 10,
    number: 0
  };

  beforeEach(async () => {
    visitServiceMock = {
      getVisits: jest.fn().mockReturnValue(of(mockResponse))
    } as any;

    await TestBed.configureTestingModule({
      declarations: [
        VisitListComponent,
        MockInputComponent,
        MockButtonComponent
      ],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: VisitService, useValue: visitServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(VisitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.visits).toEqual(mockVisits);
    expect(component.loading).toBeFalsy();
    expect(component.error).toBeFalsy();
    expect(component.currentPage).toBe(1);
    expect(component.pageSize).toBe(10);
    expect(component.totalPages).toBe(2);
  });

  it('should initialize form with empty values', () => {
    expect(component.visitForm.get('startDate')?.value).toBe('');
    expect(component.visitForm.get('endDate')?.value).toBe('');
    expect(component.visitForm.get('location')?.value).toBe('');
  });

  it('should load visits on init', () => {
    expect(visitServiceMock.getVisits).toHaveBeenCalledWith({
      startDate: '',
      endDate: '',
      location: '',
      page: 0,
      size: 10
    });
    expect(component.visits).toEqual(mockVisits);
    expect(component.totalPages).toBe(2);
  });

  it('should handle error when loading visits', () => {
    visitServiceMock.getVisits.mockReturnValueOnce(throwError(() => new Error('Test error')));
    component.loadVisits();
    expect(component.error).toBeTruthy();
    expect(component.loading).toBeFalsy();
  });

  it('should update visits when form values change', async () => {
    const formValues = {
      startDate: '2024-03-20',
      endDate: '2024-03-21',
      location: 'Test Location'
    };

    component.visitForm.patchValue(formValues);
    fixture.detectChanges();

    // Wait for debounceTime (300ms)
    await new Promise(resolve => setTimeout(resolve, 350));

    expect(visitServiceMock.getVisits).toHaveBeenCalledWith({
      ...formValues,
      page: 0,
      size: 10
    });
  });

  it('should reset filters and reload visits', () => {
    component.visitForm.patchValue({
      startDate: '2024-03-20',
      endDate: '2024-03-21',
      location: 'Test Location'
    });

    component.resetFilters();

    expect(component.visitForm.get('startDate')?.value).toBe('');
    expect(component.visitForm.get('endDate')?.value).toBe('');
    expect(component.visitForm.get('location')?.value).toBe('');

    expect(visitServiceMock.getVisits).toHaveBeenCalledWith({
      startDate: '',
      endDate: '',
      location: '',
      page: 0,
      size: 10
    });
  });

  it('should change page and reload visits', () => {
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(visitServiceMock.getVisits).toHaveBeenCalledWith({
      startDate: '',
      endDate: '',
      location: '',
      page: 1,
      size: 10
    });
  });

  it('should not reload visits if page number is the same', () => {
    const initialCallCount = visitServiceMock.getVisits.mock.calls.length;
    component.onPageChange(1);
    expect(visitServiceMock.getVisits.mock.calls.length).toBe(initialCallCount);
  });

  it('should show loading state while fetching visits', () => {
    component.loading = true;
    fixture.detectChanges();
    
    const loadingElement = fixture.debugElement.query(By.css('.loading-state'));
    expect(loadingElement).toBeTruthy();
  });

  it('should show error state when there is an error', () => {
    component.error = true;
    fixture.detectChanges();
    
    const errorElement = fixture.debugElement.query(By.css('.error-state'));
    expect(errorElement).toBeTruthy();
  });

  it('should show no results message when visits array is empty', () => {
    component.visits = [];
    fixture.detectChanges();
    
    const noResultsElement = fixture.debugElement.query(By.css('.no-results'));
    expect(noResultsElement).toBeTruthy();
  });

  it('should display visits when they are loaded', () => {
    component.visits = mockVisits;
    fixture.detectChanges();
    
    const visitCards = fixture.debugElement.queryAll(By.css('.visit-card'));
    expect(visitCards.length).toBe(mockVisits.length);
  });

  it('should unsubscribe from observables on destroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
}); 