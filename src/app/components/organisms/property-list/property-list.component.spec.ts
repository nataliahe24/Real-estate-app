import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PropertyListComponent } from './property-list.component';
import { PropertyService } from '@core/services/properties/property.service';
import { CategoryService } from '@core/services/categories/category.service';
import { FormControl, ReactiveFormsModule, FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { PropertyResponse } from '@core/models/property.model';
import { FiltersModalComponent } from '@components/molecules/filters-modal/filters-modal.component';
import { NO_ERRORS_SCHEMA, Component, forwardRef } from '@angular/core';
import { AtomsModule } from '@app/components/atoms/atoms.module';
import { MoleculesModule } from '@app/components/molecules/molecules.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MOCK_PROPERTIES } from '@app/shared/utils/mocks/mock-properties';
import { PaginatedPropertiesResponse, PropertyFilters } from '@core/models/property.model';


@Component({
  selector: 'app-input',
  template: '<input>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockInputComponent),
      multi: true
    }
  ]
})
class MockInputComponent implements ControlValueAccessor {
  writeValue(value: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState(isDisabled: boolean): void {}
}

@Component({
  selector: 'app-category-select',
  template: '<select></select>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockCategorySelectComponent),
      multi: true
    }
  ]
})
class MockCategorySelectComponent implements ControlValueAccessor {
  writeValue(value: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState(isDisabled: boolean): void {}
}

describe('PropertyListComponent', () => {
  let component: PropertyListComponent;
  let fixture: ComponentFixture<PropertyListComponent>;
  let propertyService: jest.Mocked<PropertyService>;
  let categoryService: jest.Mocked<CategoryService>;

  

  const mockPropertyService = {
    getFilteredProperties: jest.fn().mockReturnValue(of({
      content: MOCK_PROPERTIES,
      page: 0,
      size: 10,
      totalElements: 2,
      totalPages: 1
    }))
  };

  const mockCategoryService = {
    getCategories: jest.fn().mockReturnValue(of([]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PropertyListComponent,
        FiltersModalComponent,
        MockInputComponent,
        MockCategorySelectComponent
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: PropertyService, useValue: mockPropertyService },
        { provide: CategoryService, useValue: mockCategoryService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyListComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.inject(PropertyService) as jest.Mocked<PropertyService>;
    categoryService = TestBed.inject(CategoryService) as jest.Mocked<CategoryService>;
    
    component.searchControl = new FormControl('');
    component.categoryControl = new FormControl('');
    component.roomsControl = new FormControl('');
    component.bathroomsControl = new FormControl('');
    component.minPriceControl = new FormControl('');
    component.maxPriceControl = new FormControl('');
    component.sortByControl = new FormControl('');
    
   
    component.ngOnInit();
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadProperties', () => {
    it('should load properties with default filters', fakeAsync(() => {
      component.loadProperties();
      tick(300); 
      
      expect(propertyService.getFilteredProperties).toHaveBeenCalledWith({
        page: 0,
        size: 10,
        sortBy: 'price',
        orderAsc: true
      });
      expect(component.properties).toEqual(MOCK_PROPERTIES);
    }));

    it('should handle error when loading properties', fakeAsync(() => {
      const error = new Error('Test error');
      mockPropertyService.getFilteredProperties.mockReturnValueOnce(throwError(() => error));
      
      component.loadProperties();
      tick(300);
      
      expect(component.loading).toBeFalsy();
    }));
  });

  describe('sorting functionality', () => {
    beforeEach(() => {
      component.properties = [...MOCK_PROPERTIES];
    });

    it('should sort properties by location', fakeAsync(() => {
      component.sortByControl.setValue('location');
      component.orderAsc = true;
      
      component.loadProperties();
      tick(300);
      
      expect(component.properties[0].city).toBe('City A');
      expect(component.properties[1].city).toBe('City B');
    }));

    it('should sort properties by category', fakeAsync(() => {
      component.sortByControl.setValue('category');
      component.orderAsc = true;
      
      component.loadProperties();
      tick(300);
      
      expect(component.properties[0].category).toBe('Apartamento');
      expect(component.properties[1].category).toBe('Casa');
    }));

    it('should sort properties in descending order', fakeAsync(() => {
      component.sortByControl.setValue('location');
      component.orderAsc = false;
      
      component.loadProperties();
      tick(300);
      
      expect(component.properties[0].city).toBe('City B');
      expect(component.properties[1].city).toBe('City A');
    }));
  });

  describe('pagination', () => {
    it('should calculate total pages correctly', () => {
      component.totalItems = 25;
      component.pageSize = 10;
      
      expect(component.totalPages).toBe(3);
    });

    it('should update current page and reload properties', () => {
      const newPage = 2;
      const loadPropertiesSpy = jest.spyOn(component, 'loadProperties');
      
      component.onPageChange(newPage);
      
      expect(component.currentPage).toBe(newPage);
      expect(loadPropertiesSpy).toHaveBeenCalled();
    });
  });

  describe('filters', () => {
    it('should apply filters correctly', fakeAsync(() => {
      const filters = {
        rooms: 3,
        bathrooms: 2,
        minPrice: 100000,
        maxPrice: 300000
      };
      
      component.onFiltersApplied(filters);
      tick(300);
      
      expect(component.roomsControl.value).toBe('3');
      expect(component.bathroomsControl.value).toBe('2');
      expect(component.minPriceControl.value).toBe('100000');
      expect(component.maxPriceControl.value).toBe('300000');
    }));

    it('should handle undefined filter values', fakeAsync(() => {
      const filters = {
        rooms: undefined,
        bathrooms: undefined,
        minPrice: undefined,
        maxPrice: undefined
      };
      
      component.onFiltersApplied(filters);
      tick(300);
      
      expect(component.roomsControl.value).toBe('');
      expect(component.bathroomsControl.value).toBe('');
      expect(component.minPriceControl.value).toBe('');
      expect(component.maxPriceControl.value).toBe('');
    }));
  });

  describe('cleanup', () => {
    it('should unsubscribe from all subscriptions on destroy', () => {
      const nextSpy = jest.spyOn(component['destroy$'], 'next');
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
}); 