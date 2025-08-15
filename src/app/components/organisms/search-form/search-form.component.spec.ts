import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFormComponent } from './search-form.component';
import { ReactiveFormsModule, FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PropertyService } from '@app/core/services/properties/property.service';
import { of, throwError } from 'rxjs';
import { Component, forwardRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CategoryService } from '@app/core/services/categories/category.service';
import { LocationService } from '@app/core/services/locations/location.service';

// Mock components that implement ControlValueAccessor
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
  selector: 'app-button',
  template: '<button></button>'
})
class MockButtonComponent {}

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

@Component({
  selector: 'app-location-select',
  template: '<select></select>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockLocationSelectComponent),
      multi: true
    }
  ]
})
class MockLocationSelectComponent implements ControlValueAccessor {
  writeValue(value: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState(isDisabled: boolean): void {}
}

const mockPropertiesResponse = {
  content: [{ id: 1, name: 'Propiedad 1' }],
  totalElements: 1
};

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let propertyServiceMock: any;
  let categoryServiceMock: any;
  let locationServiceMock: any;

  beforeEach(async () => {
    propertyServiceMock = {
      getFilteredProperties: jest.fn().mockReturnValue(of(mockPropertiesResponse))
    };

    categoryServiceMock = {
      getCategories: jest.fn().mockReturnValue(of([]))
    };

    locationServiceMock = {
      getLocations: jest.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      declarations: [
        SearchFormComponent,
        MockInputComponent,
        MockButtonComponent,
        MockCategorySelectComponent,
        MockLocationSelectComponent
      ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: PropertyService, useValue: propertyServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: LocationService, useValue: locationServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.searchForm).toBeDefined();
    expect(component.searchForm.get('sortBy')?.value).toBe('price');
  });

  it('should call propertyService.getFilteredProperties on loadProperties', () => {
    component.loadProperties();
    expect(propertyServiceMock.getFilteredProperties).toHaveBeenCalled();
    expect(component.properties.length).toBe(1);
    expect(component.totalItems).toBe(1);
    expect(component.loading).toBe(false);
  });

  it('should handle error on loadProperties', () => {
    propertyServiceMock.getFilteredProperties.mockReturnValueOnce(throwError(() => new Error('error')));
    component.loadProperties();
    expect(component.error).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('should remove a filter and reload properties', () => {
    component.activeFilters = { location: 'loc' };
    component.searchForm.get('location')?.setValue('loc');
    const spy = jest.spyOn(component, 'loadProperties');
    component.removeFilter('location');
    expect(component.searchForm.get('location')?.value).toBe('');
    expect(component.activeFilters.location).toBeUndefined();
    expect(spy).toHaveBeenCalled();
  });

  it('should toggle filters', () => {
    const initial = component.showFilters;
    component.toggleFilters();
    expect(component.showFilters).toBe(!initial);
  });

  it('should change view mode', () => {
    component.onViewModeChange('list');
    expect(component.viewMode).toBe('list');
    component.onViewModeChange('grid');
    expect(component.viewMode).toBe('grid');
  });

  it('should change sort and reload', () => {
    component.onSortChange('rooms');
    expect(component.searchForm.get('sortBy')?.value).toBe('rooms');
  });

  it('should change order and reload', () => {
    const spy = jest.spyOn(component, 'loadProperties');
    component.onOrderChange(false);
    expect(component.orderAsc).toBe(false);
    expect(spy).toHaveBeenCalled();
  });

  it('should return correct totalCount', () => {
    component.totalItems = 42;
    expect(component.totalCount).toBe(42);
  });

  it('should detect active filters', () => {
    component.activeFilters = { location: 'loc' };
    expect(component.hasActiveFilters()).toBe(true);
    component.activeFilters = {};
    expect(component.hasActiveFilters()).toBe(false);
  });

  it('should handle category change', () => {
    component.onCategoryChange('test-category');
    expect(component.categoryControl.value).toBe('test-category');
  });

  it('should handle filters change', () => {
    const filters = {
      location: 'test-location',
      category: 'test-category',
      rooms: 2,
      bathrooms: 1,
      minPrice: 100000,
      maxPrice: 200000
    };
    const spy = jest.spyOn(component, 'loadProperties');
    component.onFiltersChange(filters);
    expect(component.searchForm.value).toEqual({
      ...filters,
      sortBy: 'price'
    });
    expect(component.currentPage).toBe(1);
    expect(spy).toHaveBeenCalled();
  });
}); 