import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PropertyService } from './property.service';
import { PropertyResponse, Property, PaginatedPropertiesResponse } from '../../models/property.model';
import { environment } from '../../../../environments/environment';

describe('PropertyService', () => {
  let service: PropertyService;
  let httpMock: HttpTestingController;

  const mockProperties: PropertyResponse[] = [
    {
      id: 1,
      name: 'Casa en la playa',
      address: 'Calle 123',
      description: 'Hermosa casa frente al mar',
      price: 150000,
      category: 'Casa',
      rooms: 3,
      bathrooms: 2,
      neighborhood: 'Miami Beach',
      city: 'Miami',
      department: 'Florida',
      activePublicationDate: '2024-01-01',
      publicationStatus: 'ACTIVE',
      sellerId: 1
    }
  ];

  const mockPaginatedResponse: PaginatedPropertiesResponse = {
    content: mockProperties,
    page: 0,
    size: 20,
    totalElements: 1,
    totalPages: 1
  };

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
        expect(properties).toEqual(mockProperties);
      });

      const req = httpMock.expectOne(`${environment.apiUrlProperties}/list?page=0&size=20&orderAsc=true`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should return properties with category filter', () => {
      const filters = { category: 'Casa' };
      service.getProperties(filters).subscribe(properties => {
        expect(properties).toEqual(mockProperties);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrlProperties}/list?category=Casa&page=0&size=20&orderAsc=true`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should return properties with location filter', () => {
      const filters = { location: 'Miami' };
      service.getProperties(filters).subscribe(properties => {
        expect(properties).toEqual(mockProperties);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrlProperties}/list?location=Miami&page=0&size=20&orderAsc=true`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
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

      const req = httpMock.expectOne(`${environment.apiUrlProperties}/list?page=0&size=20&orderAsc=true`);
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

      const req = httpMock.expectOne(`${environment.apiUrlProperties}/list?page=0&size=20&orderAsc=true`);
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
});