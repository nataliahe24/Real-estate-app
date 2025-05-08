import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertiesComponent } from './properties.component';
import { PropertyService } from '../../core/services/properties/property.service';
import { CategoryService } from '../../core/services/categories/category.service';
import { of, throwError } from 'rxjs';
import { MOCK_CATEGORIES, MOCK_PROPERTIES } from '../../shared/utils/constants/mock-categories';

describe('PropertiesComponent', () => {
  let component: PropertiesComponent;
  let fixture: ComponentFixture<PropertiesComponent>;
  let propertyServiceMock: any;
  let categoryServiceMock: any;

  beforeEach(async () => {
    propertyServiceMock = {
      getProperties: jest.fn().mockReturnValue(of(MOCK_PROPERTIES))
    };
    categoryServiceMock = {
      getCategoryNames: jest.fn().mockReturnValue(of(MOCK_CATEGORIES.map(c => c.name)))
    };

    await TestBed.configureTestingModule({
      declarations: [PropertiesComponent],
      providers: [
        { provide: PropertyService, useValue: propertyServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load properties on init', () => {
    component.ngOnInit();
    expect(propertyServiceMock.getProperties).toHaveBeenCalled();
    expect(component.properties.length).toBe(MOCK_PROPERTIES.length);
  });

  it('should load categories on init', () => {
    component.ngOnInit();
    expect(categoryServiceMock.getCategoryNames).toHaveBeenCalled();
    expect(component.categories.length).toBe(MOCK_CATEGORIES.length);
  });

  it('should handle error when loading properties', () => {
    propertyServiceMock.getProperties.mockReturnValueOnce(throwError(() => new Error('error')));
    component.loadProperties();
    expect(component.error).toBe(true);
  });
  
  it('should update currentFilter.category and call loadProperties on onCategoryChange', () => {
    const spy = jest.spyOn(component, 'loadProperties');
    component.currentFilter = { location: 'Madrid', category: '' };
    component.onCategoryChange('Casa');
    expect(component.currentFilter.category).toBe('Casa');
    expect(spy).toHaveBeenCalled();
  });
}); 