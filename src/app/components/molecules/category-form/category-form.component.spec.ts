import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryFormComponent } from './category-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AtomsModule } from '@app/components/atoms/atoms.module';
import { CategoryService } from '@app/core/services/categories/category.service';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { of, throwError } from 'rxjs';

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;
  let categoryService: jest.Mocked<CategoryService>;
  let notificationService: jest.Mocked<NotificationService>;

  const mockCategoryService = {
    createCategory: jest.fn()
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryFormComponent],
      imports: [ReactiveFormsModule, AtomsModule],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService) as jest.Mocked<CategoryService>;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.categoryForm.get('name')?.value).toBe('');
    expect(component.categoryForm.get('description')?.value).toBe('');
  });

  it('should validate name field', () => {
    const nameControl = component.categoryForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.valid).toBeFalsy();
    expect(nameControl?.errors?.['required']).toBeTruthy();

    nameControl?.setValue('ab');
    expect(nameControl?.valid).toBeFalsy();
    expect(nameControl?.errors?.['minlength']).toBeTruthy();

    nameControl?.setValue('a'.repeat(51));
    expect(nameControl?.valid).toBeFalsy();
    expect(nameControl?.errors?.['maxlength']).toBeTruthy();
  });

  it('should validate description field', () => {
    const descControl = component.categoryForm.get('description');
    descControl?.setValue('');
    expect(descControl?.valid).toBeFalsy();
    expect(descControl?.errors?.['required']).toBeTruthy();

    descControl?.setValue('short');
    expect(descControl?.valid).toBeFalsy();
    expect(descControl?.errors?.['minlength']).toBeTruthy();

    descControl?.setValue('a'.repeat(91));
    expect(descControl?.valid).toBeFalsy();
    expect(descControl?.errors?.['maxlength']).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should show warning when name is required', () => {
      const nameControl = component.categoryForm.get('name');
      nameControl?.setValue('');
      nameControl?.markAsDirty();
      
      component.createCategory();
      
      expect(notificationService.warning).toHaveBeenCalledWith('El nombre es requerido');
    });

    it('should show warning when name is too short', () => {
      const nameControl = component.categoryForm.get('name');
      nameControl?.setValue('ab'); // Less than NAME_MIN_LENGTH
      nameControl?.markAsDirty();
      
      component.createCategory();
      
      expect(notificationService.warning).toHaveBeenCalledWith(
        `El nombre debe tener al menos ${component.NAME_MIN_LENGTH} caracteres`
      );
    });

    it('should show warning when name is too long', () => {
      const nameControl = component.categoryForm.get('name');
      nameControl?.setValue('a'.repeat(component.NAME_MAX_LENGTH + 1));
      nameControl?.markAsDirty();
      
      component.createCategory();
      
      expect(notificationService.warning).toHaveBeenCalledWith(
        `El nombre no puede exceder ${component.NAME_MAX_LENGTH} caracteres`
      );
    });

    it('should show warning when description is required', () => {
      const descControl = component.categoryForm.get('description');
      descControl?.setValue('');
      descControl?.markAsDirty();
      
      component.createCategory();
      
      expect(notificationService.warning).toHaveBeenCalledWith('La descripción es requerida');
    });

    it('should show warning when description is too short', () => {
      const descControl = component.categoryForm.get('description');
      descControl?.setValue('short'); // Less than DESC_MIN_LENGTH
      descControl?.markAsDirty();
      
      component.createCategory();
      
      expect(notificationService.warning).toHaveBeenCalledWith(
        `La descripción debe tener al menos ${component.DESC_MIN_LENGTH} caracteres`
      );
    });

    it('should show warning when description is too long', () => {
      const descControl = component.categoryForm.get('description');
      descControl?.setValue('a'.repeat(component.DESC_MAX_LENGTH + 1));
      descControl?.markAsDirty();
      
      component.createCategory();
      
      expect(notificationService.warning).toHaveBeenCalledWith(
        `La descripción no puede exceder ${component.DESC_MAX_LENGTH} caracteres`
      );
    });
  });

  describe('Form Submission', () => {
    const validCategory = {
      name: 'Test Category',
      description: 'This is a test category description that meets the minimum length requirement'
    };

    it('should create category successfully', () => {
      mockCategoryService.createCategory.mockReturnValue(of({}));
      component.categoryForm.patchValue(validCategory);
      
      component.createCategory();
      
      expect(categoryService.createCategory).toHaveBeenCalledWith(validCategory);
      expect(notificationService.success).toHaveBeenCalledWith('Categoría creada con éxito');
      expect(component.categoryForm.pristine).toBeTruthy();
    });

    it('should handle category already exists error', () => {
      mockCategoryService.createCategory.mockReturnValue(throwError(() => ({})));
      component.categoryForm.patchValue(validCategory);
      
      component.createCategory();
      
      expect(notificationService.error).toHaveBeenCalledWith('La categoría ya existe');
    });
  });

  describe('Form Reset', () => {
    it('should reset form and show info message on skip', () => {
      component.categoryForm.patchValue({
        name: 'Test Category',
        description: 'Test Description'
      });
      
      component.onSkip();
      
      expect(component.categoryForm.pristine).toBeTruthy();
      expect(notificationService.info).toHaveBeenCalledWith('Formulario cancelado');
    });
  });
});