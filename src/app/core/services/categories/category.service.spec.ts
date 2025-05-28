import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../../models/category.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MOCK_CATEGORIES } from '@app/shared/utils/mocks/mock-categories';


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
  const apiUrl = 'http://localhost:8090/api/v1/category/';

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

  describe('getCategories', () => {
    it('should fetch categories successfully', () => {
      const mockCategories = {
        content: [
          { id: 1, name: 'Category 1', description: 'Description 1' },
          { id: 2, name: 'Category 2', description: 'Description 2' }
        ],
        totalElements: 2,
        totalPages: 1
      };

      service.getCategories().subscribe(data => {
        expect(data).toEqual(mockCategories);
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
    });

    it('should handle server error', () => {
      service.getCategories().subscribe({
        error: (error) => {
          expect(error.message).toBe('Error del servidor. Por favor, intente más tarde.');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true`);
      req.flush('Server Error', { 
        status: 500, 
        statusText: 'Internal Server Error' 
      });
    });

    it('should handle connection error', () => {
      service.getCategories().subscribe({
        error: (error) => {
          expect(error.message).toBe('Error en el servidor');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true`);
      req.error(new ErrorEvent('Network Error'));
    });
  });

  describe('createCategory', () => {
    const newCategory = { name: 'New Category', description: 'New Description' };

    it('should create category successfully', () => {
      const mockResponse = { id: 1, ...newCategory };

      service.createCategory(newCategory).subscribe(data => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle duplicate category error', () => {
      service.createCategory(newCategory).subscribe({
        error: (error) => {
          expect(error.message).toBe('Ya existe una categoría con ese nombre');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Category already exists', { 
        status: 409, 
        statusText: 'Conflict' 
      });
    });

    it('should handle name max size exceeded error', () => {
      service.createCategory(newCategory).subscribe({
        error: (error) => {
          expect(error.message).toBe('El nombre excede el tamaño máximo permitido');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('NAME_MAX_SIZE_EXCEEDED', { 
        status: 400, 
        statusText: 'Bad Request' 
      });
    });

    it('should handle description max size exceeded error', () => {
      service.createCategory(newCategory).subscribe({
        error: (error) => {
          expect(error.message).toBe('La descripción excede el tamaño máximo permitido');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('DESCRIPTION_MAX_SIZE_EXCEEDED', { 
        status: 400, 
        statusText: 'Bad Request' 
      });
    });
  });

  describe('getCategory', () => {
    const categoryId = 1;

    it('should fetch single category successfully', () => {
      const mockCategory = { 
        id: categoryId, 
        name: 'Category 1', 
        description: 'Description 1' 
      };

      service.getCategory(categoryId).subscribe(data => {
        expect(data).toEqual(mockCategory);
      });

      const req = httpMock.expectOne(`${apiUrl}${categoryId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategory);
    });

    it('should handle not found error', () => {
      service.getCategory(categoryId).subscribe({
        error: (error) => {
          expect(error.message).toBe('No se encontró la categoría solicitada');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}${categoryId}`);
      req.flush('Category not found', { 
        status: 404, 
        statusText: 'Not Found' 
      });
    });
  });

  describe('updateCategory', () => {
    const category = { 
      id: 1, 
      name: 'Updated Category', 
      description: 'Updated Description' 
    };

    it('should update category successfully', () => {
      service.updateCategory(category).subscribe(data => {
        expect(data).toEqual(category);
      });

      const req = httpMock.expectOne(`${apiUrl}${category.id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(category);
    });

    it('should handle unauthorized error', () => {
      service.updateCategory(category).subscribe({
        error: (error) => {
          expect(error.message).toBe('No autorizado. Por favor, inicie sesión nuevamente.');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}${category.id}`);
      req.flush('Unauthorized', { 
        status: 401, 
        statusText: 'Unauthorized' 
      });
    });

    it('should handle forbidden error', () => {
      service.updateCategory(category).subscribe({
        error: (error) => {
          expect(error.message).toBe('No tiene permisos para realizar esta acción.');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}${category.id}`);
      req.flush('Forbidden', { 
        status: 403, 
        statusText: 'Forbidden' 
      });
    });
  });
});


