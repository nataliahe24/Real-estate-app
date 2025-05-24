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

  describe('getProperties', () => {
    it('should return properties with default filters', () => {
      service.getProperties().subscribe(properties => {
        expect(properties).toEqual(MOCK_PROPERTIES);
      });

      const req = httpMock.expectOne(`${apiUrl}list?page=0&size=20&orderAsc=true`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PAGINATED_PROPERTIES);
    });

    it('should return properties with category filter', () => {
      const filters = { category: 'Casa' };
      service.getProperties(filters).subscribe(properties => {
        expect(properties).toEqual(MOCK_PROPERTIES);
      });

      const req = httpMock.expectOne(
        `${apiUrl}list?category=Casa&page=0&size=20&orderAsc=true`
      );
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PAGINATED_PROPERTIES);
    });

    it('should return properties with location filter', () => {
      const filters = { location: 'Miami' };
      service.getProperties(filters).subscribe(properties => {
        expect(properties).toEqual(MOCK_PROPERTIES);
      });

      const req = httpMock.expectOne(
        `${apiUrl}list?location=Miami&page=0&size=20&orderAsc=true`
      );
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PAGINATED_PROPERTIES);
    });

    it('should handle empty response', () => {
      const emptyResponse: PaginatedPropertiesResponse = {
        content: [],
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0
      };

      service.getProperties().subscribe(properties => {
        expect(properties).toEqual([]);
      });

      const req = httpMock.expectOne(`${apiUrl}list?page=0&size=20&orderAsc=true`);
      expect(req.request.method).toBe('GET');
      req.flush(emptyResponse);
    });

    it('should handle error response', () => {
      const errorMessage = 'Error loading properties';
      
      service.getProperties().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}list?page=0&size=20&orderAsc=true`);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { 
        status: 500, 
        statusText: errorMessage 
      });
    });
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

      const req = httpMock.expectOne(`${environment.apiUrlProperties}/`);
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
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProperties}/`);
      expect(req.request.method).toBe('POST');
      req.flush(errorMessage, { 
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

      const req = httpMock.expectOne(`${environment.apiUrlProperties}?page=0&size=10&orderAsc=true`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PAGINATED_PROPERTIES);
    });

    it('should make GET request with all filters', () => {
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
        maxPrice: 300000
      };


      service.getFilteredProperties(filters).subscribe(response => {
        expect(response).toEqual(MOCK_PAGINATED_PROPERTIES);
      });

      const expectedUrl = `${environment.apiUrlProperties}?page=1&size=5&orderAsc=false&sortBy=price&location=Bogota&category=Casa&rooms=3&bathrooms=2&minPrice=100000&maxPrice=300000`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PAGINATED_PROPERTIES);
    });

    it('should handle error response', () => {
      const errorResponse = {
        status: 404,
        statusText: 'Not Found'
      };

      service.getFilteredProperties({}).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProperties}?page=0&size=10&orderAsc=true`);
      req.flush('Error', errorResponse);
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

      const req = httpMock.expectOne(`${environment.apiUrlProperties}?page=0&size=10&orderAsc=true`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PAGINATED_PROPERTIES);
    });



    it('should handle undefined orderAsc correctly', () => {
      
      service.getFilteredProperties({
        orderAsc: undefined
      }).subscribe(response => {
        expect(response).toEqual(MOCK_PAGINATED_PROPERTIES);
      });

      const req = httpMock.expectOne(`${environment.apiUrlProperties}?page=0&size=10&orderAsc=true`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PAGINATED_PROPERTIES);
    });

    it('should handle custom page size', () => {
   

      service.getFilteredProperties({
        size: 20
      }).subscribe(response => {
        expect(response).toEqual(MOCK_PAGINATED_PROPERTIES);
      });

      const req = httpMock.expectOne(`${environment.apiUrlProperties}?page=0&size=20&orderAsc=true`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PAGINATED_PROPERTIES);
    });
  });
});