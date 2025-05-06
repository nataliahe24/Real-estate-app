import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../../models/category.model';
import { HttpErrorResponse } from '@angular/common/http';


jest.mock('./category.service', () => {
  const original = jest.requireActual('./category.service');
  return {
    ...original,
    CategoryService: class extends original.CategoryService {
      testApiConnection() {
        
        return;
      }
    }
  };
});

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get categories with pagination', () => {
    const mockResponse = {
      content: [{ id: '1', name: 'Test Category', description: 'Test Description' }],
      totalElements: 1,
      totalPages: 1,
      number: 0
    };

    service.getCategories(0, 10, true).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      req => req.url === 'http://localhost:8090/api/v1/category/' && 
             req.params.get('page') === '0'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle array response in getCategories', () => {
    const mockResponse = [
      { id: '1', name: 'Category 1', description: 'Description 1' },
      { id: '2', name: 'Category 2', description: 'Description 2' }
    ];

    service.getCategories(0, 10, true).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      req => req.url === 'http://localhost:8090/api/v1/category/'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a category', () => {
    const newCategory = { name: 'New Category', description: 'New Description' };
    const mockResponse = { id: '1', ...newCategory };

    service.createCategory(newCategory).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8090/api/v1/category/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCategory);
    req.flush(mockResponse);
  });

  it('should update a category', () => {
    const category: Category = { 
      id: '1', 
      name: 'Updated Category', 
      description: 'Updated Description' 
    };
    
    service.updateCategory(category).subscribe(data => {
      expect(data).toEqual(category);
    });

    const req = httpMock.expectOne(`http://localhost:8090/api/v1/category/${category.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(category);
    req.flush(category);
  });

  it('should delete a category', () => {
    const categoryId = '1';
    const mockResponse = { success: true };
    
    service.deleteCategory(categoryId).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:8090/api/v1/category/${categoryId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should throw error when deleting with undefined id', (done) => {
    service.deleteCategory(undefined).subscribe({
      next: () => fail('Expected an error'),
      error: (error) => {
        expect(error.message).toContain('ID undefined');
        done();
      }
    });
  });

  it('should get a single category by id', () => {
    const categoryId = 1;
    const mockCategory: Category = { 
      id: '1', 
      name: 'Test Category', 
      description: 'Test Description' 
    };
    
    service.getCategory(categoryId).subscribe(data => {
      expect(data).toEqual(mockCategory);
    });

    const req = httpMock.expectOne(`http://localhost:8090/api/v1/category/${categoryId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategory);
  });

  it('should handle client-side error', () => {
    service.getCategories(0, 10, true).subscribe({
      next: () => fail('Expected an error'),
      error: (error) => {
        expect(error.message).toContain('0:');
      }
    });

    const req = httpMock.expectOne(
      req => req.url === 'http://localhost:8090/api/v1/category/'
    );
    
    // Simular un error de red (status 0)
    const mockError = new ErrorEvent('Network error', {
      message: 'Connection refused'
    });
    
    req.error(mockError);
  });

  it('should handle server-side error', () => {
    service.getCategories(0, 10, true).subscribe({
      next: () => fail('Expected an error'),
      error: (error) => {
        expect(error.message).toContain('500:');
      }
    });

    const req = httpMock.expectOne(
      req => req.url === 'http://localhost:8090/api/v1/category/'
    );
    
    // Simular un error del servidor (status 500)
    req.flush('Server error', { 
      status: 500, 
      statusText: 'Internal Server Error' 
    });
  });
}); 