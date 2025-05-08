import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertySearchComponent } from './property-search.component';
import { PropertyService } from '../../../core/services/properties/property.service';
import { of, throwError } from 'rxjs';
import { MOCK_PROPERTIES } from '../../../shared/utils/constants/mock-categories';

describe('PropertySearchComponent', () => {
  let component: PropertySearchComponent;
  let fixture: ComponentFixture<PropertySearchComponent>;
  let propertyServiceMock: any;

  beforeEach(async () => {
    propertyServiceMock = {
      getProperties: jest.fn().mockReturnValue(of(MOCK_PROPERTIES))
    };

    await TestBed.configureTestingModule({
      declarations: [PropertySearchComponent],
      providers: [
        { provide: PropertyService, useValue: propertyServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load properties on init', () => {
    component.ngOnInit();
    expect(propertyServiceMock.getProperties).toHaveBeenCalled();
    expect(component.properties.length).toBe(MOCK_PROPERTIES.length);
  });

  it('should handle error when loading properties', () => {
    propertyServiceMock.getProperties.mockReturnValueOnce(throwError(() => new Error('error')));
    component.searchProperties();
    expect(component.error).toBe('Failed to load properties');
  });

  it('should call propertyService.getProperties with empty filters if no filters are set', () => {
    component.selectedCategoryId = '';
    component.locationQuery = '';
    component.searchProperties();
    expect(propertyServiceMock.getProperties).toHaveBeenCalledWith({});
  });
  
  it('should set properties to empty array if service returns empty', () => {
    propertyServiceMock.getProperties.mockReturnValueOnce(of([]));
    component.searchProperties();
    expect(component.properties).toEqual([]);
    expect(component.isLoading).toBe(false);
    expect(component.error).toBeNull();
  });
  
  it('should not call searchProperties in onCategoryChange', () => {
    const spy = jest.spyOn(component, 'searchProperties');
    component.onCategoryChange('Departamento');
    expect(component.selectedCategoryName).toBe('Departamento');
    expect(spy).not.toHaveBeenCalled();
  });
  
}); 