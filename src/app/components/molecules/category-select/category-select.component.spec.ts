import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategorySelectComponent } from './category-select.component';
import { CategoryService } from '@core/services/categories/category.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '../../atoms/select/select.component';
import { CommonModule } from '@angular/common';

describe('CategorySelectComponent', () => {
  let component: CategorySelectComponent;
  let fixture: ComponentFixture<CategorySelectComponent>;
  let categoryService: jest.Mocked<CategoryService>;

  const mockCategories = [
    { id: '1', name: 'Casa', description: 'Vivienda unifamiliar' },
    { id: '2', name: 'Apartamento', description: 'Vivienda en conjunto' },
    { id: '3', name: 'Local', description: 'Espacio comercial' }
  ];

  const mockCategoryService = {
    getCategoryNames: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CategorySelectComponent,
        SelectComponent
      ],
      imports: [
        CommonModule,
        FormsModule
      ],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategorySelectComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService) as jest.Mocked<CategoryService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.selectedCategoryName).toBe('');
      expect(component.categories).toEqual([]);
      expect(component.isLoading).toBe(true);
      expect(component.error).toBeNull();
    });

    it('should load categories on init', () => {
      mockCategoryService.getCategoryNames.mockReturnValue(of(mockCategories));
      fixture.detectChanges();
      expect(categoryService.getCategoryNames).toHaveBeenCalledWith(true);
    });

    it('should handle empty category array', () => {
      mockCategoryService.getCategoryNames.mockReturnValue(of([]));
      fixture.detectChanges();

      expect(component.categories).toEqual([]);
      expect(component.isLoading).toBe(false);
      expect(component.error).toBeNull();
    });

    it('should handle invalid category format', () => {
      mockCategoryService.getCategoryNames.mockReturnValue(of(null));
      fixture.detectChanges();

      expect(component.error).toBe('El formato de categorías es incorrecto');
      expect(component.isLoading).toBe(false);
    });

    it('should handle API error', () => {
      const errorMessage = 'Network error';
      mockCategoryService.getCategoryNames.mockReturnValue(
        throwError(() => ({ message: errorMessage }))
      );
      fixture.detectChanges();

      expect(component.error).toBe('Failed to load categories: ' + errorMessage);
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Category Selection', () => {
    it('should emit selected category name', () => {
      const selectedCategory = 'Casa';
      component.selectedCategoryName = selectedCategory;
      
      const spy = jest.spyOn(component.categorySelected, 'emit');
      component.onCategorySelected();

      expect(spy).toHaveBeenCalledWith(selectedCategory);
    });

    it('should handle category selection with empty value', () => {
      component.selectedCategoryName = '';
      
      const spy = jest.spyOn(component.categorySelected, 'emit');
      component.onCategorySelected();

      expect(spy).toHaveBeenCalledWith('');
    });
  })
});