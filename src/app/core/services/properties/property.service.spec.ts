import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PropertyService } from './property.service';
import { PropertyResponse, Property, PaginatedPropertiesResponse } from '../../models/property.model';
import { environment } from '../../../../environments/environment';
import { PropertyFilters } from '@core/models/property.model';
import { MOCK_PAGINATED_PROPERTIES, MOCK_PROPERTIES } from '@app/shared/utils/mocks/mock-properties';

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

    it('should handle specific error responses', () => {
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

    it('should handle network errors', () => {
      service.getFilteredProperties({}).subscribe({
        error: (error: Error) => {
          expect(error.message).toBe('Error de conexión. Por favor, intente nuevamente.');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProperties}?page=0&size=10&orderAsc=true&sortBy=price`);
      req.error(new ErrorEvent('Network error'));
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
  });
});