import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategorySelectComponent } from './category-select.component';
import { CategoryService } from '@app/core/services/categories/category.service';
import { of, throwError } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from '../../atoms/select/select.component';
import { CommonModule } from '@angular/common';
import { Category } from '@app/core/models/category.model';
import { MOCK_CATEGORIES } from '../../../shared/utils/mocks/mock-categories';

describe('CategorySelectComponent', () => {
  let component: CategorySelectComponent;
  let fixture: ComponentFixture<CategorySelectComponent>;
  let categoryService: jest.Mocked<CategoryService>;

  const mockCategoryService = {
    getCategories: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CategorySelectComponent,
        SelectComponent
      ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
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
      mockCategoryService.getCategories.mockReturnValue(of({ content: MOCK_CATEGORIES }));
      fixture.detectChanges();

      expect(categoryService.getCategories).toHaveBeenCalledWith(0, 100, true);
      expect(component.categories).toEqual(MOCK_CATEGORIES);
      expect(component.isLoading).toBe(false);
      expect(component.error).toBeNull();
    });

    it('should handle empty category array', () => {
      mockCategoryService.getCategories.mockReturnValue(of({ content: [] }));
      fixture.detectChanges();

      expect(component.categories).toEqual([]);
      expect(component.isLoading).toBe(false);
      expect(component.error).toBeNull();
    });

    it('should handle invalid category format', () => {
      mockCategoryService.getCategories.mockReturnValue(of(null));
      fixture.detectChanges();

      expect(component.error).toBe('El formato de categorías es incorrecto');
      expect(component.isLoading).toBe(false);
    });

    it('should handle API error', () => {
      const errorMessage = 'Network error';
      mockCategoryService.getCategories.mockReturnValue(
        throwError(() => ({ message: errorMessage }))
      );
      fixture.detectChanges();

      expect(component.error).toBe('Error al cargar categorías: ' + errorMessage);
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Category Selection', () => {
    beforeEach(() => {
      mockCategoryService.getCategories.mockReturnValue(of({ content: MOCK_CATEGORIES }));
      fixture.detectChanges();
    });



    it('should handle category selection with empty value', () => {
      component.selectedCategoryName = '';
      
      const categorySelectedSpy = jest.spyOn(component.categorySelected, 'emit');
      const categoryIdSelectedSpy = jest.spyOn(component.categoryIdSelected, 'emit');
      
      component.onCategorySelected();

      expect(categorySelectedSpy).toHaveBeenCalledWith('');
      expect(categoryIdSelectedSpy).toHaveBeenCalledWith(null);
    });

    it('should update selected category when categoryIdSelected is called', () => {
      const categoryId = 1;
      const category = MOCK_CATEGORIES.find(c => Number(c.id) === categoryId);
      component.selectedCategoryName = category?.name || '';
      component.onCategorySelected();
      expect(component.selectedCategoryId).toBe(categoryId);
    });

    it('should handle invalid category ID', () => {
      const invalidId = 999;
      component.selectedCategoryName = '';
      component.onCategorySelected();
      expect(component.selectedCategoryId).toBe(null);
    });
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      mockCategoryService.getCategories.mockReturnValue(of({ content: MOCK_CATEGORIES }));
      fixture.detectChanges();
    });

    it('should render select element with categories', () => {
      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('select');
      expect(select).toBeTruthy();
      expect(select.options.length).toBe(MOCK_CATEGORIES.length + 1); 
    });

    it('should show loading state', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const loadingElement = compiled.querySelector('.loading');
      expect(loadingElement).toBeTruthy();
      expect(loadingElement.textContent).toContain('Cargando categorías');
    });

    it('should show error message when error occurs', () => {
      component.error = 'Error loading categories';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const errorElement = compiled.querySelector('.error');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('Error loading categories');
    });
  });
}); 