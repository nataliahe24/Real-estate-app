import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { User, CreateUserDto, Role } from '@core/models/user.model';
import { environment } from '@env/environment';
import { MOCK_USER, MOCK_USER_RESPONSE, MOCK_ROLE } from '@app/shared/utils/mocks/mock-user';
import { NotificationService } from '@core/services/notifications/notification.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsersService,
        {
          provide: NotificationService,
          useValue: {
            error: jest.fn()
          }
        }
      ]
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService);
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUser', () => {
    it('should create a user successfully', () => {
      service.createUser(MOCK_USER).subscribe(user => {
        expect(user).toEqual(MOCK_USER_RESPONSE);
      });

      const req = httpMock.expectOne(`${environment.apiUrlUsers}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ...MOCK_USER, role: MOCK_ROLE.id });
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(MOCK_USER_RESPONSE);
    });

    it('should handle existing user error', () => {
      const errorMessage = 'Ya existe un usuario registrado con este correo electrónico';
      
      service.createUser(MOCK_USER).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlUsers}`);
      req.flush(
        { message: 'El usuario ya existe' },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should handle server error', () => {
      const errorMessage = 'Server error';
      
      service.createUser(MOCK_USER).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlUsers}`);
      req.flush(errorMessage, { 
        status: 500, 
        statusText: errorMessage 
      });
    });
  });

  describe('validateUserData', () => {
    it('should validate correct user data', () => {
      expect(() => service.createUser(MOCK_USER)).not.toThrow();
    });
  });

  describe('handleError', () => {
    it('should handle network errors', () => {
      service.createUser(MOCK_USER).subscribe({
        error: (error: Error) => {
          expect(error.message).toBe('Error de conexión. Por favor, intente nuevamente.');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlUsers}`);
      req.error(new ErrorEvent('Network error'));
      expect(notificationService.error).toHaveBeenCalledWith('Error de conexión. Por favor, intente nuevamente.');
    });

    it('should handle specific HTTP errors', () => {
      const errorCases = [
        { status: 400, message: 'Datos inválidos. Por favor, verifique la información.' },
        { status: 401, message: 'No autorizado. Por favor, inicie sesión nuevamente.' },
        { status: 403, message: 'No tiene permisos para realizar esta acción.' },
        { status: 404, message: 'No se encontró la información solicitada' },
        { status: 409, message: 'Ya existe un usuario registrado con este correo electrónico' },
        { status: 500, message: 'Error del servidor. Por favor, intente más tarde.' }
      ];

      errorCases.forEach(({ status, message }) => {
        service.createUser(MOCK_USER).subscribe({
          error: (error: Error) => {
            expect(error.message).toBe(message);
          }
        });

        const req = httpMock.expectOne(`${environment.apiUrlUsers}`);
        req.flush({ message }, { 
          status, 
          statusText: `HTTP Error ${status}` 
        });
        expect(notificationService.error).toHaveBeenCalledWith(message);
      });
    });

    it('should handle custom error messages from server', () => {
      const customMessage = 'Mensaje de error personalizado';
      
      service.createUser(MOCK_USER).subscribe({
        error: (error: Error) => {
          expect(error.message).toBe(customMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlUsers}`);
      req.flush({ message: customMessage }, { 
        status: 400, 
        statusText: 'Bad Request' 
      });
      expect(notificationService.error).toHaveBeenCalledWith(customMessage);
    });
  });
}); 