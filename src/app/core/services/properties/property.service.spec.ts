import { TestBed } from '@angular/core/testing';
import { PropertyService } from './property.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { MOCK_PROPERTIES } from '../../../shared/utils/constants/mock-categories';

describe('PropertyService', () => {
  let service: PropertyService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrlProperties.replace(/\/$/, '')}/list`;

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

  it('should get properties with filters', () => {
    service.getProperties({ category: 'Casa', location: 'Madrid' }).subscribe(properties => {
      expect(properties).toEqual(MOCK_PROPERTIES);
    });

    const req = httpMock.expectOne(
      r => r.url === apiUrl && r.params.has('category') && r.params.has('location')
    );
    expect(req.request.method).toBe('GET');
    req.flush({ content: MOCK_PROPERTIES });
  });

  it('should handle error on getProperties', () => {
    service.getProperties({ category: 'Casa' }).subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(apiUrl + '?category=Casa&page=0&size=20&orderAsc=true');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should get property by id', () => {
    const mockProperty = MOCK_PROPERTIES[0];
    service.getPropertyById(1).subscribe(property => {
      expect(property).toEqual(mockProperty);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProperty);
  });


});