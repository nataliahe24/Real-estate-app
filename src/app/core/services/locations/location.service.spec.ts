import { TestBed } from '@angular/core/testing';
import { LocationService } from './location.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@env/environment';
import { LocationModel, LocationResponse } from '@app/core/models/location.model';

describe('LocationService', () => {
  let service: LocationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocationService]
    });
    service = TestBed.inject(LocationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get locations', () => {
    const mockLocations: LocationModel[] = [
      { cityName: 'City 1', neighborhood: 'Neighborhood 1' },
      { cityName: 'City 2', neighborhood: 'Neighborhood 2' }
    ];

    service.getLocations().subscribe(locations => {
      expect(locations).toEqual(mockLocations);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}location/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLocations);
  });

  it('should create location', () => {
    const newLocation = { cityName: 'New City', neighborhood: 'New Neighborhood' };
    const mockResponse: LocationResponse = {
      id: 1,
      cityName: 'New City',
      neighborhood: 'New Neighborhood',
      department: 'Department 1'
    };

    service.createLocation(newLocation).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}location/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newLocation);
    req.flush(mockResponse);
  });

  it('should find locations by city or department', () => {
    const searchText = 'test';
    const page = 1;
    const size = 10;
    const orderAsc = true;
    const mockResponse = {
      content: [
        { id: 1, cityName: 'Test City', neighborhood: 'Test Neighborhood', department: 'Test Department' }
      ],
      totalElements: 1
    };

    service.findByCityOrDepartment(searchText, page, size, orderAsc).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}location/?searchText=${searchText}&page=${page}&size=${size}&orderAsc=${orderAsc}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error when getting locations', () => {
    service.getLocations().subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}location/`);
    req.error(new ErrorEvent('Network error'));
  });

  it('should handle error correctly', () => {
    const testError = new Error('Test error');
    const result = service['handleError'](testError);
    
    result.subscribe({
      error: (error) => {
        expect(error).toBe(testError);
      }
    });
  });
}); 