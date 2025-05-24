import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { User, CreateUserDto, Role } from '@core/models/user.model';
import { environment } from '@env/environment';
import { MOCK_USER, MOCK_USER_RESPONSE, MOCK_ROLE } from '@app/shared/utils/mocks/mock-user';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService]
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
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

    it('should throw error for invalid email', () => {
      const invalidUser = { ...MOCK_USER, email: 'invalid-email' };
      expect(() => service.createUser(invalidUser)).toThrow(
        'El correo electrónico ingresado no tiene un formato inválido.'
      );
    });

    it('should throw error for invalid phone number', () => {
      const invalidUser = { ...MOCK_USER, phoneNumber: '123' };
      expect(() => service.createUser(invalidUser)).toThrow(
        'El numero de telefono no puede exceder los 13 caracteres'
      );
    });

    it('should throw error for invalid identity document', () => {
      const invalidUser = { ...MOCK_USER, identityDocument: 'ABC123' as any };
      expect(() => service.createUser(invalidUser)).toThrow(
        'El documento de identidad debe contener solo números'
      );
    });

    it('should throw error for underage user', () => {
      const underageUser = { 
        ...MOCK_USER, 
        birthDate: new Date() 
      };
      expect(() => service.createUser(underageUser)).toThrow(
        'La edad del usuario no cumple con el mínimo permitido'
      );
    });
  });
}); 