import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFormComponent } from './search-form.component';
import { CategoryService } from '../../../core/services/categories/category.service';
import { PropertyService } from '@app/core/services/properties/property.service';
import { of, throwError } from 'rxjs';
import { MOCK_CATEGORIES, MOCK_PROPERTIES } from '@app/shared/utils/constants/mock-properties';


describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let categoryServiceSpy: jest.Mocked<CategoryService>;
  let propertyServiceSpy: jest.Mocked<PropertyService>;

  beforeEach(async () => {
    const categorySpy = {
      getCategoryNames: jest.fn()
    };
    const propertySpy = {
      getProperties: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [SearchFormComponent],
      providers: [
        { provide: CategoryService, useValue: categorySpy },
        { provide: PropertyService, useValue: propertySpy }
      ]
    }).compileComponents();

    categoryServiceSpy = TestBed.inject(CategoryService) as jest.Mocked<CategoryService>;
    propertyServiceSpy = TestBed.inject(PropertyService) as jest.Mocked<PropertyService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load properties on init', () => {
    categoryServiceSpy.getCategoryNames.mockReturnValue(of(MOCK_CATEGORIES.map(c => c.name)));
    propertyServiceSpy.getProperties.mockReturnValue(of(MOCK_PROPERTIES));

    fixture.detectChanges();

    expect(propertyServiceSpy.getProperties).toHaveBeenCalledWith({});
    expect(component.properties).toEqual(MOCK_PROPERTIES);
    expect(component.loading).toBeFalsy();
  });

  it('should handle category change', () => {
    categoryServiceSpy.getCategoryNames.mockReturnValue(of(MOCK_CATEGORIES.map(c => c.name)));
    propertyServiceSpy.getProperties.mockReturnValue(of(MOCK_PROPERTIES));

    fixture.detectChanges();

    component.onCategoryChange('House');

    expect(component.category).toBe('House');
    expect(propertyServiceSpy.getProperties).toHaveBeenCalledWith({ category: 'House' });
  });

  it('should emit search event', () => {
    const searchSpy = jest.spyOn(component.search, 'emit');
    component.location = 'New York';
    component.category = 'House';

    component.onSearch();

    expect(searchSpy).toHaveBeenCalledWith({
      location: 'New York',
      category: 'House'
    });
  });

  it('should handle error when loading properties', () => {
    categoryServiceSpy.getCategoryNames.mockReturnValue(of(MOCK_CATEGORIES.map(c => c.name)));
    propertyServiceSpy.getProperties.mockReturnValue(throwError(() => new Error('Test error')));

    fixture.detectChanges();

    expect(component.error).toBeTruthy();
    expect(component.loading).toBeFalsy();
  });
}); 