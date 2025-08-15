import { TestBed } from '@angular/core/testing';
import { VisitService } from './visit.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from '../notifications/notification.service';
import { Visit, VisitResponse } from '@core/models/visit.model';
import { environment } from '@env/environment';
import { MOCK_VISIT_RESPONSE_PAGE, MOCK_VISIT_RESPONSE, MOCK_VISIT_RESPONSE_LIST, MOCK_VISIT } from '@shared/utils/mocks/mock-visit';
import { HttpErrorResponse } from '@angular/common/http';

describe('VisitService', () => {
  let service: VisitService;
  let httpMock: HttpTestingController;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VisitService, NotificationService]
    });

    service = TestBed.inject(VisitService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a visit successfully', () => {
    service.createVisit(MOCK_VISIT_RESPONSE_LIST).subscribe(response => {
      expect(response).toEqual(MOCK_VISIT_RESPONSE_LIST);
      expect(notificationService.success).toHaveBeenCalledWith('Horario programado exitosamente');
    });

    const req = httpMock.expectOne(environment.apiUrlVisits);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(MOCK_VISIT_RESPONSE_LIST);
    req.flush(MOCK_VISIT_RESPONSE_LIST);
  });

  it('should handle error when creating visit', () => {
    const errorMessage = 'Error al crear la visita';
    service.createVisit(MOCK_VISIT_RESPONSE_LIST).subscribe({
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
      startDate: new Date('2024-03-20').toISOString(),
      endDate: new Date('2024-03-21').toISOString(),
      location: 'Bogotá',
      page: 0,
      size: 10
    };

    service.getVisits(params).subscribe(response => {
      expect(response).toEqual(MOCK_VISIT_RESPONSE_PAGE);
    });

    const req = httpMock.expectOne(`${environment.apiUrlVisits}?startDate=2024-03-20T00:00:00.000Z&endDate=2024-03-21T00:00:00.000Z&location=Bogot%C3%A1&page=0&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_VISIT_RESPONSE_PAGE);
  });

  it('should handle error when getting visits', () => {
    const errorMessage = 'Error al obtener las visitas';
    service.getVisits({}).subscribe({
      error: (error) => {
        expect(error.message).toBe(errorMessage);
        expect(notificationService.error).toHaveBeenCalledWith(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrlVisits}?page=0&size=10`);
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle network error', () => {
    service.getVisits({}).subscribe({
      error: (error) => {
        expect(error.message).toBe('Error de conexión. Por favor, intente nuevamente.');
        expect(notificationService.error).toHaveBeenCalledWith('Error de conexión. Por favor, intente nuevamente.');
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrlVisits}?page=0&size=10`);
    req.error(new ErrorEvent('Network error'));
  });

  it('should handle 401 unauthorized error', () => {
    service.getVisits({}).subscribe({
      error: (error) => {
        expect(error.message).toBe('No autorizado. Por favor, inicie sesión nuevamente.');
        expect(notificationService.error).toHaveBeenCalledWith('No autorizado. Por favor, inicie sesión nuevamente.');
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrlVisits}?page=0&size=10`);
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

    const req = httpMock.expectOne(`${environment.apiUrlVisits}?page=0&size=10`);
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

    const req = httpMock.expectOne(`${environment.apiUrlVisits}?page=0&size=10`);
    req.flush({ message: errorMessage }, { status: 404, statusText: 'Not Found' });
  });

  it('should handle 404 not found error without custom message', () => {
    service.getVisits({}).subscribe({
      error: (error) => {
        expect(error.message).toBe('No se encontró la información solicitada');
        expect(notificationService.error).toHaveBeenCalledWith('No se encontró la información solicitada');
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrlVisits}?page=0&size=10`);
    req.flush({}, { status: 404, statusText: 'Not Found' });
  });

  it('should handle 500 server error', () => {
    service.getVisits({}).subscribe({
      error: (error) => {
        expect(error.message).toBe('Error del servidor. Por favor, intente más tarde.');
        expect(notificationService.error).toHaveBeenCalledWith('Error del servidor. Por favor, intente más tarde.');
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrlVisits}?page=0&size=10`);
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

    const req = httpMock.expectOne(`${environment.apiUrlVisits}?page=0&size=10`);
    req.flush({ message: errorMessage }, { status: 418, statusText: 'I\'m a teapot' });
  });

  describe('handleError', () => {
    it('should handle 400 Bad Request error', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Invalid data' },
        status: 400
      });

      const spy = jest.spyOn(notificationService, 'error');
      service['handleError'](errorResponse).subscribe({
        error: (error) => {
          expect(error.message).toBe('Invalid data');
          expect(spy).toHaveBeenCalledWith('Invalid data');
        }
      });
    });

    it('should handle 401 Unauthorized error', () => {
      const errorResponse = new HttpErrorResponse({
        status: 401
      });

      const spy = jest.spyOn(notificationService, 'error');
      service['handleError'](errorResponse).subscribe({
        error: (error) => {
          expect(error.message).toBe('No autorizado. Por favor, inicie sesión nuevamente.');
          expect(spy).toHaveBeenCalledWith('No autorizado. Por favor, inicie sesión nuevamente.');
        }
      });
    });

    it('should handle 403 Forbidden error with custom message', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Custom forbidden message' },
        status: 403
      });

      const spy = jest.spyOn(notificationService, 'error');
      service['handleError'](errorResponse).subscribe({
        error: (error) => {
          expect(error.message).toBe('Custom forbidden message');
          expect(spy).toHaveBeenCalledWith('Custom forbidden message');
        }
      });
    });

    it('should handle 404 Not Found error with custom message', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Resource not found' },
        status: 404
      });

      const spy = jest.spyOn(notificationService, 'error');
      service['handleError'](errorResponse).subscribe({
        error: (error) => {
          expect(error.message).toBe('Resource not found');
          expect(spy).toHaveBeenCalledWith('Resource not found');
        }
      });
    });

    it('should handle 500 Server Error', () => {
      const errorResponse = new HttpErrorResponse({
        status: 500
      });

      const spy = jest.spyOn(notificationService, 'error');
      service['handleError'](errorResponse).subscribe({
        error: (error) => {
          expect(error.message).toBe('Error del servidor. Por favor, intente más tarde.');
          expect(spy).toHaveBeenCalledWith('Error del servidor. Por favor, intente más tarde.');
        }
      });
    });

    it('should handle unknown error status', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Unknown error' },
        status: 999
      });

      const spy = jest.spyOn(notificationService, 'error');
      service['handleError'](errorResponse).subscribe({
        error: (error) => {
          expect(error.message).toBe('Unknown error');
          expect(spy).toHaveBeenCalledWith('Unknown error');
        }
      });
    });
  });
}); 