import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PropertyService } from './property.service';
import { PropertyResponse, Property, PaginatedPropertiesResponse } from '../../models/property.model';
import { environment } from '../../../../environments/environment';
import { PropertyFilters } from '@core/models/property.model';
import { MOCK_PAGINATED_PROPERTIES, MOCK_PROPERTIES } from '@app/shared/utils/mocks/mock-properties';
import { HttpErrorResponse } from '@angular/common/http';

describe('PropertyService', () => {
  let service: PropertyService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrlProperties;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PropertyService]
    });

    service = TestBed.inject(PropertyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createProperty', () => {
    it('should create a new property', () => {
      const newProperty: Property = {
        name: 'Nueva Casa',
        address: 'Calle Nueva 123',
        description: 'Descripción de la nueva casa',
        category: 1,
        rooms: 2,
        bathrooms: 1,
        price: 100000,
        location: 1,
        activePublicationDate: '2024-01-01',
        sellerId: 1
      };

      service.createProperty(newProperty).subscribe(property => {
        expect(property).toEqual(newProperty);
      });

      const req = httpMock.expectOne(environment.apiUrlProperties);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProperty);
      req.flush(newProperty);
    });

    it('should handle error when creating property', () => {
      const newProperty: Property = {
        name: 'Nueva Casa',
        address: 'Calle Nueva 123',
        description: 'Descripción de la nueva casa',
        category: 1,
        rooms: 2,
        bathrooms: 1,
        price: 100000,
        location: 1,
        activePublicationDate: '2024-01-01',
        sellerId: 1
      };

      const errorMessage = 'Error creating property';

      service.createProperty(newProperty).subscribe({
        error: (error: Error) => {
          expect(error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(environment.apiUrlProperties);
      expect(req.request.method).toBe('POST');
      req.flush({ message: errorMessage }, { 
        status: 400, 
        statusText: errorMessage 
      });
    });
  });

  describe('getFilteredProperties', () => {
    it('should make GET request with default parameters', () => {
      service.getFilteredProperties({}).subscribe(response => {
        expect(response).toEqual(MOCK_PAGINATED_PROPERTIES);
      });

      const req = httpMock.expectOne(`${environment.apiUrlProperties}?page=0&size=10&orderAsc=true&sortBy=price`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PAGINATED_PROPERTIES);
    });

    it('should make GET request with all filters including sellerId', () => {
      const filters: PropertyFilters = {
        page: 1,
        size: 5,
        sortBy: 'price',
        orderAsc: false,
        location: 'Bogota',
        category: 'Casa',
        rooms: 3,
        bathrooms: 2,
        minPrice: 100000,
        maxPrice: 300000,
        sellerId: 123
      };

      service.getFilteredProperties(filters).subscribe(response => {
        expect(response).toEqual(MOCK_PAGINATED_PROPERTIES);
      });

      const expectedUrl = `${environment.apiUrlProperties}?page=1&size=5&orderAsc=false&sortBy=price&sellerId=123&location=Bogota&category=Casa&rooms=3&bathrooms=2&minPrice=100000&maxPrice=300000`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PAGINATED_PROPERTIES);
    });

    it('should handle network errors', () => {
      service.getFilteredProperties({}).subscribe({
        error: (error: Error) => {
          expect(error.message).toBe('Error de conexión. Por favor, intente nuevamente.');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProperties}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle specific HTTP errors', () => {
      const errorCases = [
        { status: 400, message: 'Datos inválidos. Por favor, verifique la información.' },
        { status: 401, message: 'No autorizado. Por favor, inicie sesión nuevamente.' },
        { status: 403, message: 'No tiene permisos para realizar esta acción.' },
        { status: 404, message: 'No se encontró la información solicitada' },
        { status: 500, message: 'Error del servidor. Por favor, intente más tarde.' }
      ];

      errorCases.forEach(({ status, message }) => {
        service.getFilteredProperties({}).subscribe({
          error: (error: Error) => {
            expect(error.message).toBe(message);
          }
        });

        const req = httpMock.expectOne(`${environment.apiUrlProperties}?page=0&size=10&orderAsc=true&sortBy=price`);
        req.flush({ message }, { 
          status, 
          statusText: `HTTP Error ${status}` 
        });
      });
    });

    it('should handle custom error messages from server', () => {
      const customMessage = 'Mensaje de error personalizado';
      
      service.getFilteredProperties({}).subscribe({
        error: (error: Error) => {
          expect(error.message).toBe(customMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProperties}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({ message: customMessage }, { 
        status: 400, 
        statusText: 'Bad Request' 
      });
    });

    it('should handle empty filters correctly', () => {
      service.getFilteredProperties({
        page: undefined,
        size: undefined,
        sortBy: undefined,
        orderAsc: undefined
      }).subscribe(response => {
        expect(response).toEqual(MOCK_PAGINATED_PROPERTIES);
      });

      const req = httpMock.expectOne(`${environment.apiUrlProperties}?page=0&size=10&orderAsc=true&sortBy=price`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PAGINATED_PROPERTIES);
    });

    it('should handle undefined orderAsc correctly', () => {
      service.getFilteredProperties({
        orderAsc: undefined
      }).subscribe(response => {
        expect(response).toEqual(MOCK_PAGINATED_PROPERTIES);
      });

      const req = httpMock.expectOne(`${environment.apiUrlProperties}?page=0&size=10&orderAsc=true&sortBy=price`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PAGINATED_PROPERTIES);
    });

    it('should handle custom page size', () => {
      service.getFilteredProperties({
        size: 20
      }).subscribe(response => {
        expect(response).toEqual(MOCK_PAGINATED_PROPERTIES);
      });

      const req = httpMock.expectOne(`${environment.apiUrlProperties}?page=0&size=20&orderAsc=true&sortBy=price`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PAGINATED_PROPERTIES);
    });

    it('should handle empty response', () => {
      service.getFilteredProperties({}).subscribe(response => {
        expect(response).toEqual({ content: [], totalElements: 0 });
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({ content: [], totalElements: 0 });
    });

    it('should handle response with null values', () => {
      service.getFilteredProperties({}).subscribe(response => {
        expect(response.content).toEqual([]);
        expect(response.totalElements).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({ content: null, totalElements: null });
    });

    it('should handle response with undefined values', () => {
      service.getFilteredProperties({}).subscribe(response => {
        expect(response.content).toEqual([]);
        expect(response.totalElements).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({ content: undefined, totalElements: undefined });
    });

    it('should handle response with missing properties', () => {
      service.getFilteredProperties({}).subscribe(response => {
        expect(response.content).toEqual([]);
        expect(response.totalElements).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({});
    });

    it('should handle response with invalid data types', () => {
      service.getFilteredProperties({}).subscribe(response => {
        expect(response.content).toEqual([]);
        expect(response.totalElements).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({ content: 'invalid', totalElements: 'invalid' });
    });

    it('should handle response with partial data', () => {
      service.getFilteredProperties({}).subscribe(response => {
        expect(response.content).toEqual([]);
        expect(response.totalElements).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({ content: [] });
    });

    it('should handle response with extra properties', () => {
      service.getFilteredProperties({}).subscribe(response => {
        expect(response.content).toEqual([]);
        expect(response.totalElements).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({ 
        content: [], 
        totalElements: 0,
        extraProperty: 'extra'
      });
    });

    it('should handle response with malformed data', () => {
      service.getFilteredProperties({}).subscribe(response => {
        expect(response.content).toEqual([]);
        expect(response.totalElements).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({ 
        content: [{ invalid: 'data' }], 
        totalElements: 'invalid'
      });
    });

    it('should handle response with empty array', () => {
      service.getFilteredProperties({}).subscribe(response => {
        expect(response.content).toEqual([]);
        expect(response.totalElements).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({ 
        content: [], 
        totalElements: 0
      });
    });

    it('should handle response with single item', () => {
      const mockResponse = {
        content: [MOCK_PROPERTIES[0]],
        totalElements: 1
      };

      service.getFilteredProperties({}).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush(mockResponse);
    });
  });

  describe('handleError', () => {
    it('should handle client-side errors', () => {
      const errorEvent = new ErrorEvent('Network error');
      service.getFilteredProperties({}).subscribe({
        error: (err: Error) => {
          expect(err.message).toBe('Error de conexión. Por favor, intente nuevamente.');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.error(errorEvent);
    });

    it('should handle 400 error with custom message', () => {
      const customMessage = 'Datos inválidos específicos';
      service.getFilteredProperties({}).subscribe({
        error: (err: Error) => {
          expect(err.message).toBe(customMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({ message: customMessage }, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 401 error', () => {
      service.getFilteredProperties({}).subscribe({
        error: (err: Error) => {
          expect(err.message).toBe('No autorizado. Por favor, inicie sesión nuevamente.');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({}, { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle 403 error with custom message', () => {
      const customMessage = 'Acceso denegado específico';
      service.getFilteredProperties({}).subscribe({
        error: (err: Error) => {
          expect(err.message).toBe(customMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({ message: customMessage }, { status: 403, statusText: 'Forbidden' });
    });

    it('should handle 404 error with custom message', () => {
      const customMessage = 'Recurso no encontrado específico';
      service.getFilteredProperties({}).subscribe({
        error: (err: Error) => {
          expect(err.message).toBe(customMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({ message: customMessage }, { status: 404, statusText: 'Not Found' });
    });

    it('should handle 500 error', () => {
      service.getFilteredProperties({}).subscribe({
        error: (err: Error) => {
          expect(err.message).toBe('Error del servidor. Por favor, intente más tarde.');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle unknown error with error message', () => {
      const customMessage = 'Error desconocido';
      service.getFilteredProperties({}).subscribe({
        error: (err: Error) => {
          expect(err.message).toBe(customMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.flush({ message: customMessage }, { status: 418, statusText: 'I\'m a teapot' });
    });
  });
});