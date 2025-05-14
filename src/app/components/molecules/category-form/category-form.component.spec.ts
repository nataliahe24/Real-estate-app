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

  beforeEach(async () => {
    categoryService = {
      createCategory: jest.fn().mockReturnValue(of({}))
    } as any;

    notificationService = {
      success: jest.fn(),
      error: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [CategoryFormComponent],
      imports: [ReactiveFormsModule, AtomsModule],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: NotificationService, useValue: notificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
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

  it('should create category successfully', () => {
    const categoryData = {
      name: 'Test Category',
      description: 'Test Description'
    };

    component.categoryForm.patchValue(categoryData);
    component.createCategory();

    expect(categoryService.createCategory).toHaveBeenCalledWith(categoryData);
    expect(notificationService.success).toHaveBeenCalledWith('Categoría creada con éxito');
  });
});