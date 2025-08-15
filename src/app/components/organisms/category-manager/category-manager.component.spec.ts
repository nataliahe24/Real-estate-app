import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryManagerComponent } from './category-manager.component';
import { CategoryService } from '../../../core/services/categories/category.service';
import { NotificationService } from '../../../core/services/notifications/notification.service';
import { of, throwError } from 'rxjs';
import { validateCategory } from '../../../shared/utils/validators/validate-category';


jest.mock('../../../shared/utils/validators/validate-category', () => ({
  validateCategory: jest.fn()
}));

describe('CategoryManagerComponent', () => {
  let component: CategoryManagerComponent;
  let fixture: ComponentFixture<CategoryManagerComponent>;
  let categoryServiceMock: jest.Mocked<CategoryService>;
  let notificationServiceMock: jest.Mocked<NotificationService>;
  const mockValidateCategory = validateCategory as jest.MockedFunction<typeof validateCategory>;

  beforeEach(() => {
    categoryServiceMock = {
      getCategories: jest.fn(),
      createCategory: jest.fn(),
      deleteCategory: jest.fn()
    } as unknown as jest.Mocked<CategoryService>;

    notificationServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn()
    } as unknown as jest.Mocked<NotificationService>;

    TestBed.configureTestingModule({
      declarations: [CategoryManagerComponent],
      imports: [FormsModule],
      providers: [
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryManagerComponent);
    component = fixture.componentInstance;
    
    (validateCategory as jest.Mock).mockImplementation(() => true);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit and load categories', () => {
    const mockResponse = {
      content: [{ id: '1', name: 'Test', description: 'Test Desc' }],
      totalElements: 1,
      totalPages: 1
    };

    categoryServiceMock.getCategories.mockReturnValue(of(mockResponse));

    component.ngOnInit();

    expect(categoryServiceMock.getCategories).toHaveBeenCalledWith(0, 10, true);
    expect(component.categories).toEqual(mockResponse.content);
  });

  it('should handle paging correctly', () => {
    const mockResponse = {
      content: [{ id: '1', name: 'Category 1', description: 'Description 1' }],
      totalElements: 10,
      totalPages: 2
    };
    
    categoryServiceMock.getCategories.mockReturnValue(of(mockResponse));
    
    fixture.detectChanges();
    
    component.onPageChange(2); 
    
    expect(categoryServiceMock.getCategories).toHaveBeenCalledWith(1, 10, true);
  });

  it('should change items per page correctly', () => {
    const mockResponse = {
      content: [{ id: '1', name: 'Category 1', description: 'Description 1' }],
      totalElements: 10,
      totalPages: 1
    };
    
    categoryServiceMock.getCategories.mockReturnValue(of(mockResponse));
    
    fixture.detectChanges();
    
    component.onPageSizeChange(20);
    
    expect(component.itemsPerPage).toBe(20);
    expect(component.currentPage).toBe(0);
    expect(categoryServiceMock.getCategories).toHaveBeenCalledWith(0, 20, true);
  });

  it('should not create category when validation fails', () => {
    mockValidateCategory.mockReturnValue(false);
    
    component.createCategory();
    
    expect(categoryServiceMock.createCategory).not.toHaveBeenCalled();
  });

  it('should create a category after ngOnInit is called', () => {
    
    const mockResponse = {
      content: [],
      totalElements: 0,
      totalPages: 0
    };
    categoryServiceMock.getCategories.mockReturnValue(of(mockResponse));
    component.ngOnInit();

    const newCategory = { name: 'New Category', description: 'Description' };
    component.newCategory = { ...newCategory };
    categoryServiceMock.createCategory.mockReturnValue(of({ id: '1', ...newCategory }));

    component.createCategory();

    expect(categoryServiceMock.createCategory).toHaveBeenCalledWith(newCategory);
    expect(notificationServiceMock.success).toHaveBeenCalled();
    expect(component.newCategory).toEqual({ name: '', description: '' });
  });

  it('should handle error when creating a category', () => {
    component.newCategory = { name: 'Test', description: 'Test' };
    
    categoryServiceMock.createCategory.mockReturnValue(throwError(() => new Error('Error')));
    
    component.createCategory();
    
    expect(categoryServiceMock.createCategory).toHaveBeenCalled();
    expect(notificationServiceMock.error).toHaveBeenCalled();
  });
}); 