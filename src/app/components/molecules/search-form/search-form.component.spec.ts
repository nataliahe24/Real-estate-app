import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFormComponent } from './search-form.component';
import { CategoryService } from '@app/core/services/categories/category.service';
import { PropertyService } from '@app/core/services/properties/property.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_CATEGORIES } from '@app/shared/utils/mocks/mock-categories';
import { MOCK_PROPERTIES } from '@app/shared/utils/mocks/mock-properties';
import { PropertyCardComponent } from '@app/components/molecules/property-card/property-card.component';
import { PropertyStatusLabelComponent } from '@app/components/atoms/property-status-label/property-status-label.component';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let categoryService: jest.Mocked<CategoryService>;
  let propertyService: jest.Mocked<PropertyService>;

  const mockCategoryService = {
    getCategories: jest.fn().mockReturnValue(of({ content: MOCK_CATEGORIES }))
  };

  const mockPropertyService = {
    getProperties: jest.fn().mockReturnValue(of(MOCK_PROPERTIES))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SearchFormComponent,
        PropertyCardComponent,
        PropertyStatusLabelComponent
      ],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: PropertyService, useValue: mockPropertyService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService) as jest.Mocked<CategoryService>;
    propertyService = TestBed.inject(PropertyService) as jest.Mocked<PropertyService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onCategoryChange', () => {
    it('should update category and filter, then load properties', () => {
      const categoryName = 'Apartment';
      mockPropertyService.getProperties.mockReturnValueOnce(of(MOCK_PROPERTIES));

      component.onCategoryChange(categoryName);
      fixture.detectChanges();

      expect(component.category).toBe(categoryName);
      expect(component.currentFilter.category).toBe(categoryName);
      expect(propertyService.getProperties).toHaveBeenCalledWith(
        { category: categoryName }
      );
    });
  });

  describe('onSearch', () => {
    it('should emit search event with location and category', () => {
      const searchSpy = jest.spyOn(component.search, 'emit');
      component.location = 'New York';
      component.category = 'Apartment';

      component.onSearch();

      expect(searchSpy).toHaveBeenCalledWith({
        location: 'New York',
        category: 'Apartment'
      });
    });
  });

  describe('Form Submission', () => {
    it('should emit search criteria when location and category are set', () => {
      const searchSpy = jest.spyOn(component.search, 'emit');
      component.location = 'New York';
      component.category = 'Apartment';
  
      component.onSearch();
  
      expect(searchSpy).toHaveBeenCalledWith({
        location: 'New York',
        category: 'Apartment'
      });
    });
  
    it('should emit empty values if location and category are empty', () => {
      const searchSpy = jest.spyOn(component.search, 'emit');
      component.location = '';
      component.category = '';
  
      component.onSearch();
  
      expect(searchSpy).toHaveBeenCalledWith({
        location: '',
        category: ''
      });
    });
  });
});