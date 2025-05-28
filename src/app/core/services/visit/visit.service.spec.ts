import { TestBed } from '@angular/core/testing';
import { VisitService } from './visit.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from '../notifications/notification.service';
import { Visit, VisitResponse } from '@core/models/visit.model';
import { environment } from '@env/environment';
import { MOCK_VISIT, MOCK_VISIT_RESPONSE } from '@shared/utils/mocks/mock-visit';

describe('VisitService', () => {
  let service: VisitService;
  let httpMock: HttpTestingController;
  let notificationService: jest.Mocked<NotificationService>;


  beforeEach(() => {
    notificationService = {
      success: jest.fn(),
      error: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VisitService,
        { provide: NotificationService, useValue: notificationService }
      ]
    });

    service = TestBed.inject(VisitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a visit successfully', () => {
    service.createVisit(MOCK_VISIT).subscribe(response => {
      expect(response).toEqual(MOCK_VISIT);
      expect(notificationService.success).toHaveBeenCalledWith('Horario programado exitosamente');
    });

    const req = httpMock.expectOne(environment.apiUrlVisits);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(MOCK_VISIT);
    req.flush(MOCK_VISIT);
  });

  it('should handle error when creating visit', () => {
    const errorMessage = 'Error al crear la visita';
    service.createVisit(MOCK_VISIT).subscribe({
      error: (error) => {
        expect(error.message).toBe(errorMessage);
        expect(notificationService.error).toHaveBeenCalledWith(errorMessage);
      }
    });

    const req = httpMock.expectOne(environment.apiUrlVisits);
    req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });
  });

  it('should get visits with query parameters', () => {
    const params = {
      startDate: '2024-03-20',
      endDate: '2024-03-21',
      location: 'Bogotá',
      page: 0,
      size: 10
    };

    service.getVisits(params).subscribe(response => {
      expect(response).toEqual(MOCK_VISIT_RESPONSE);
    });

    const req = httpMock.expectOne(`${environment.apiUrlVisits}?startDate=2024-03-20&endDate=2024-03-21&location=Bogot%C3%A1&page=0&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_VISIT_RESPONSE);
  });

  it('should handle error when getting visits', () => {
    const errorMessage = 'Error al obtener las visitas';
    service.getVisits({}).subscribe({
      error: (error) => {
        expect(error.message).toBe(errorMessage);
        expect(notificationService.error).toHaveBeenCalledWith(errorMessage);
      }
    });

    const req = httpMock.expectOne(environment.apiUrlVisits);
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle network error', () => {
    service.getVisits({}).subscribe({
      error: (error) => {
        expect(error.message).toBe('Error de conexión. Por favor, intente nuevamente.');
        expect(notificationService.error).toHaveBeenCalledWith('Error de conexión. Por favor, intente nuevamente.');
      }
    });

    const req = httpMock.expectOne(environment.apiUrlVisits);
    req.error(new ErrorEvent('Network error'));
  });

  it('should handle 401 unauthorized error', () => {
    service.getVisits({}).subscribe({
      error: (error) => {
        expect(error.message).toBe('No autorizado. Por favor, inicie sesión nuevamente.');
        expect(notificationService.error).toHaveBeenCalledWith('No autorizado. Por favor, inicie sesión nuevamente.');
      }
    });

    const req = httpMock.expectOne(environment.apiUrlVisits);
    req.flush({}, { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle 403 forbidden error with custom message', () => {
    const errorMessage = 'No tiene permisos para ver estas visitas';
    service.getVisits({}).subscribe({
      error: (error) => {
        expect(error.message).toBe(errorMessage);
        expect(notificationService.error).toHaveBeenCalledWith(errorMessage);
      }
    });

    const req = httpMock.expectOne(environment.apiUrlVisits);
    req.flush({ message: errorMessage }, { status: 403, statusText: 'Forbidden' });
  });

  it('should handle 404 not found error with custom message', () => {
    const errorMessage = 'No se encontraron visitas';
    service.getVisits({}).subscribe({
      error: (error) => {
        expect(error.message).toBe(errorMessage);
        expect(notificationService.error).toHaveBeenCalledWith(errorMessage);
      }
    });

    const req = httpMock.expectOne(environment.apiUrlVisits);
    req.flush({ message: errorMessage }, { status: 404, statusText: 'Not Found' });
  });

  it('should handle 404 not found error without custom message', () => {
    service.getVisits({}).subscribe({
      error: (error) => {
        expect(error.message).toBe('No se encontró la información solicitada');
        expect(notificationService.error).toHaveBeenCalledWith('No se encontró la información solicitada');
      }
    });

    const req = httpMock.expectOne(environment.apiUrlVisits);
    req.flush({}, { status: 404, statusText: 'Not Found' });
  });

  it('should handle 500 server error', () => {
    service.getVisits({}).subscribe({
      error: (error) => {
        expect(error.message).toBe('Error del servidor. Por favor, intente más tarde.');
        expect(notificationService.error).toHaveBeenCalledWith('Error del servidor. Por favor, intente más tarde.');
      }
    });

    const req = httpMock.expectOne(environment.apiUrlVisits);
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle unknown error status', () => {
    const errorMessage = 'Error desconocido';
    service.getVisits({}).subscribe({
      error: (error) => {
        expect(error.message).toBe(`Error 418: ${errorMessage}`);
        expect(notificationService.error).toHaveBeenCalledWith(`Error 418: ${errorMessage}`);
      }
    });

    const req = httpMock.expectOne(environment.apiUrlVisits);
    req.flush({ message: errorMessage }, { status: 418, statusText: 'I\'m a teapot' });
  });
}); 