import { TestBed } from '@angular/core/testing';
import { BuyerVisitService } from './buyer-visit.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from '../notifications/notification.service';
import { environment } from '@env/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { MOCK_BUYER_VISIT, MOCK_RESPONSE } from '@app/shared/utils/mocks/mock-buyer-visit';

describe('BuyerVisitService', () => {
  let service: BuyerVisitService;
  let httpMock: HttpTestingController;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BuyerVisitService, NotificationService]
    });

    service = TestBed.inject(BuyerVisitService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a buyer visit successfully', () => {
    service.createBuyerVisit(MOCK_BUYER_VISIT).subscribe(response => {
      expect(response).toEqual(MOCK_RESPONSE);
      expect(notificationService.success).toHaveBeenCalledWith(
        'Visita programada exitosamente'
      );
    });

    const req = httpMock.expectOne(environment.apiUrlBuyerVisit);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(MOCK_BUYER_VISIT);
    req.flush(MOCK_RESPONSE);
  });

  it('should handle network error', () => {
    service.createBuyerVisit(MOCK_BUYER_VISIT).subscribe({
      error: (error) => {
        expect(error.message).toBe(
          'Error de conexión. Por favor, intente nuevamente.'
        );
        expect(notificationService.error).toHaveBeenCalledWith(
          'Error de conexión. Por favor, intente nuevamente.'
        );
      }
    });

    const req = httpMock.expectOne(environment.apiUrlBuyerVisit);
    req.error(new ErrorEvent('Network error'));
  });

  it('should handle 400 Bad Request error', () => {
    const errorMessage = 'Datos inválidos';
        service.createBuyerVisit(MOCK_BUYER_VISIT).subscribe({
      error: (error) => {
        expect(error.message).toBe(errorMessage);
        expect(notificationService.error).toHaveBeenCalledWith(errorMessage);
      }
    });

    const req = httpMock.expectOne(environment.apiUrlBuyerVisit);
    req.flush({ message: errorMessage }, { 
      status: 400, 
      statusText: 'Bad Request' 
    });
  });

  it('should handle 403 Forbidden error', () => {
    const errorMessage = 'No tienes permisos para realizar esta acción';
    service.createBuyerVisit(MOCK_BUYER_VISIT).subscribe({
      error: (error) => {
        expect(error.message).toBe(errorMessage);
        expect(notificationService.error).toHaveBeenCalledWith(errorMessage);
      }
    });

    const req = httpMock.expectOne(environment.apiUrlBuyerVisit);
    req.flush({ message: errorMessage }, { 
      status: 403, 
      statusText: 'Forbidden' 
    });
  });

  it('should handle 500 Server Error', () => {
    const errorMessage = 'Error del servidor';
    service.createBuyerVisit(MOCK_BUYER_VISIT).subscribe({
      error: (error) => {
        expect(error.message).toBe(errorMessage);
        expect(notificationService.error).toHaveBeenCalledWith(errorMessage);
      }
    });

    const req = httpMock.expectOne(environment.apiUrlBuyerVisit);
    req.flush({ message: errorMessage }, { 
      status: 500, 
      statusText: 'Internal Server Error' 
    });
  });

  it('should handle unknown error status', () => {
    const errorMessage = 'Error desconocido';
    service.createBuyerVisit(MOCK_BUYER_VISIT).subscribe({
      error: (error) => {
        expect(error.message).toBe(`Error 418: ${errorMessage}`);
        expect(notificationService.error).toHaveBeenCalledWith(
          `Error 418: ${errorMessage}`
        );
      }
    });

    const req = httpMock.expectOne(environment.apiUrlBuyerVisit);
    req.flush({ message: errorMessage }, { 
      status: 418, 
      statusText: 'I\'m a teapot' 
    });
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

    it('should handle 403 Forbidden error', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Access denied' },
        status: 403
      });

      const spy = jest.spyOn(notificationService, 'error');
      service['handleError'](errorResponse).subscribe({
        error: (error) => {
          expect(error.message).toBe('Access denied');
          expect(spy).toHaveBeenCalledWith('Access denied');
        }
      });
    });

    it('should handle 500 Server Error', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Server error' },
        status: 500
      });

      const spy = jest.spyOn(notificationService, 'error');
      service['handleError'](errorResponse).subscribe({
        error: (error) => {
          expect(error.message).toBe('Server error');
          expect(spy).toHaveBeenCalledWith('Server error');
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