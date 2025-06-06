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
import { AuthService } from '@core/services/auth/auth.service';
import { AUTH_RESPONSE } from '@app/shared/utils/mocks/mock-user';


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
  let authService: jest.Mocked<AuthService>;

  

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

  const mockAuthService = {
    getCurrentUser: jest.fn().mockReturnValue(AUTH_RESPONSE)
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
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyListComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.inject(PropertyService) as jest.Mocked<PropertyService>;
    categoryService = TestBed.inject(CategoryService) as jest.Mocked<CategoryService>;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    
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
        orderAsc: true,
        sellerId: AUTH_RESPONSE.id,
        location: undefined,
        category: undefined,
        rooms: undefined,
        bathrooms: undefined,
        minPrice: undefined,
        maxPrice: undefined
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

  describe('filter management', () => {
    it('should update active filters when control values change', fakeAsync(() => {
      component.roomsControl.setValue('3');
      tick(300);
      expect(component.activeFilters.rooms).toBe('3');

      component.bathroomsControl.setValue('2');
      tick(300);
      expect(component.activeFilters.bathrooms).toBe('2');

      component.minPriceControl.setValue('100000');
      tick(300);
      expect(component.activeFilters.minPrice).toBe('100000');

      component.maxPriceControl.setValue('300000');
      tick(300);
      expect(component.activeFilters.maxPrice).toBe('300000');
    }));

    it('should reset current page when filters change', fakeAsync(() => {
      component.currentPage = 2;
      component.roomsControl.setValue('3');
      tick(300);
      expect(component.currentPage).toBe(1);
    }));

    it('should handle empty filter values', fakeAsync(() => {
      component.roomsControl.setValue('');
      tick(300);
      expect(component.activeFilters.rooms).toBeUndefined();
    }));
  });

  describe('filter removal', () => {
    beforeEach(() => {
      component.activeFilters = {
        rooms: '3',
        bathrooms: '2',
        minPrice: '100000',
        maxPrice: '300000'
      };
    });

    it('should remove rooms filter', () => {
      component.removeFilter('rooms');
      expect(component.roomsControl.value).toBe('');
      expect(component.activeFilters.rooms).toBeUndefined();
      expect(component.currentPage).toBe(1);
    });

    it('should remove bathrooms filter', () => {
      component.removeFilter('bathrooms');
      expect(component.bathroomsControl.value).toBe('');
      expect(component.activeFilters.bathrooms).toBeUndefined();
      expect(component.currentPage).toBe(1);
    });

    it('should remove minPrice filter', () => {
      component.removeFilter('minPrice');
      expect(component.minPriceControl.value).toBe('');
      expect(component.activeFilters.minPrice).toBeUndefined();
      expect(component.currentPage).toBe(1);
    });

    it('should remove maxPrice filter', () => {
      component.removeFilter('maxPrice');
      expect(component.maxPriceControl.value).toBe('');
      expect(component.activeFilters.maxPrice).toBeUndefined();
      expect(component.currentPage).toBe(1);
    });
  });

  describe('filter status', () => {
    it('should return true when filters are active', () => {
      component.activeFilters = { rooms: '3' };
      expect(component.hasActiveFilters()).toBeTruthy();
    });

    it('should return false when no filters are active', () => {
      component.activeFilters = {};
      expect(component.hasActiveFilters()).toBeFalsy();
    });
  });

  describe('filter application', () => {
    it('should apply all filters correctly', () => {
      const filters = {
        rooms: 3,
        bathrooms: 2,
        minPrice: 100000,
        maxPrice: 300000
      };

      component.onFiltersApplied(filters);

      expect(component.activeFilters).toEqual({
        rooms: '3',
        bathrooms: '2',
        minPrice: '100000',
        maxPrice: '300000'
      });
    });

    it('should handle partial filters', () => {
      const filters = {
        rooms: 3,
        bathrooms: undefined,
        minPrice: undefined,
        maxPrice: 300000
      };

      component.onFiltersApplied(filters);

      expect(component.activeFilters).toEqual({
        rooms: '3',
        maxPrice: '300000'
      });
    });
  });
}); 