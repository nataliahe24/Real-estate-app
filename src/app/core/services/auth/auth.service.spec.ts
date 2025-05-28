import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { JwtService } from '../jwt/jwt.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@env/environment';
import { Role, User } from '@core/models/user.model';
import { NotificationService } from '../notifications/notification.service';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let jwtServiceMock: any;
  let notificationServiceMock: any;

  beforeEach(() => {
    jwtServiceMock = {
      getToken: jest.fn(),
      saveToken: jest.fn(),
      destroyToken: jest.fn()
    };

    notificationServiceMock = {
      warning: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const credentials = { email: 'test@test.com', password: '123456' };
    const mockResponse = {
      email: 'test@test.com',
      message: 'Login successful',
      accessToken: 'fake-token',
      role: 3,
      id: 1,
      name: 'Test User'
    };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(jwtServiceMock.saveToken).toHaveBeenCalledWith('fake-token');
    });

    const req = httpMock.expectOne(environment.apiUrlAuth);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle login error', () => {
    const credentials = { email: 'test@test.com', password: 'wrong' };
    const errorResponse = { status: 401, statusText: 'Unauthorized' };

    service.login(credentials).subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne(environment.apiUrlAuth);
    req.flush('Invalid credentials', errorResponse);
  });

  it('should register successfully', () => {
    const userData = {
      name: 'Test User',
      email: 'test@test.com',
      password: '123456'
    };
    const mockResponse = {
      email: 'test@test.com',
      message: 'Registration successful',
      accessToken: 'fake-token',
      role: 3,
      id: 1,
      name: 'Test User'
    };

    service.register(userData).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(jwtServiceMock.saveToken).toHaveBeenCalledWith('fake-token');
    });

    const req = httpMock.expectOne(environment.apiUrlAuth);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle registration error', () => {
    const userData = {
      name: 'Test User',
      email: 'test@test.com',
      password: '123456'
    };

    service.register(userData).subscribe({
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne(environment.apiUrlAuth);
    req.flush('Email already exists', { status: 400, statusText: 'Bad Request' });
  });

  it('should verify token successfully', () => {
    const mockResponse = {
      email: 'test@test.com',
      accessToken: 'fake-token',
      role: 3,
      id: 1,
      name: 'Test User'
    };
    jwtServiceMock.getToken.mockReturnValue('fake-token');

    service.verifyToken().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.apiUrlAuth);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle token verification error', () => {
    jwtServiceMock.getToken.mockReturnValue('invalid-token');

    service.verifyToken().subscribe(response => {
      expect(response).toBeNull();
      expect(jwtServiceMock.destroyToken).toHaveBeenCalled();
    });

    const req = httpMock.expectOne(environment.apiUrlAuth);
    req.flush('Invalid token', { status: 401, statusText: 'Unauthorized' });
  });

  it('should logout successfully', () => {
    service.logout().subscribe();

    const req = httpMock.expectOne(environment.apiUrlAuth);
    expect(req.request.method).toBe('POST');
    req.flush({});
    expect(jwtServiceMock.destroyToken).toHaveBeenCalled();
  });

  it('should handle logout error', () => {
    service.logout().subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(environment.apiUrlAuth);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    expect(jwtServiceMock.destroyToken).toHaveBeenCalled();
  });

  it('should get current user', () => {
    const mockUser = {
      email: 'test@test.com',
      accessToken: 'fake-token',
      role: 3,
      id: 1,
      message: 'Success',
      name: 'Test User'
    };
    service['currentUserSubject'].next(mockUser);
    expect(service.getCurrentUser()).toEqual(mockUser);
  });

  it('should check authentication status', () => {
    expect(service.isAuthenticated()).toBeFalsy();
    service['currentUserSubject'].next({ 
      email: 'test@test.com', 
      accessToken: 'fake-token', 
      role: 3, 
      id: 1,
      message: 'Success',
      name: 'Test User'
    });
    expect(service.isAuthenticated()).toBeTruthy();
  });

  it('should get user role', () => {
    const mockUser = {
      email: 'test@test.com',
      accessToken: 'fake-token',
      role: 3,
      id: 1,
      message: 'Success',
      name: 'Test User'
    };
    service['currentUserSubject'].next(mockUser);
    expect(service.getUserRole()).toBe(3);
  });

  it('should check role access', () => {
    const mockUser = {
      email: 'test@test.com',
      accessToken: 'fake-token',
      role: 3,
      id: 1,
      message: 'Success',
      name: 'Test User'
    };
    service['currentUserSubject'].next(mockUser);
    expect(service.hasRole(3)).toBeTruthy();
    expect(service.hasRole(2)).toBeFalsy();
  });

  it('should check admin role', () => {
    const mockUser = {
      email: 'test@test.com',
      accessToken: 'fake-token',
      role: 2,
      id: 1,
      message: 'Success',
      name: 'Test User'
    };
    service['currentUserSubject'].next(mockUser);
    expect(service.isAdmin()).toBeTruthy();
  });

  it('should check seller role', () => {
    const mockUser = {
      email: 'test@test.com',
      accessToken: 'fake-token',
      role: 3,
      id: 1,
      message: 'Success',
      name: 'Test User'
    };
    service['currentUserSubject'].next(mockUser);
    expect(service.isSeller()).toBeTruthy();
  });

  it('should check buyer role', () => {
    const mockUser = {
      email: 'test@test.com',
      accessToken: 'fake-token',
      role: 1,
      id: 1,
      message: 'Success',
      name: 'Test User'
    };
    service['currentUserSubject'].next(mockUser);
    expect(service.isBuyer()).toBeTruthy();
  });

  it('should validate admin access', () => {
    const mockUser = {
      email: 'test@test.com',
      accessToken: 'fake-token',
      role: 2,
      id: 1,
      message: 'Success',
      name: 'Test User'
    };
    service['currentUserSubject'].next(mockUser);
    expect(service.validateAdminAccess()).toBeTruthy();
    expect(notificationServiceMock.warning).not.toHaveBeenCalled();
  });

  it('should deny admin access for non-admin users', () => {
    const mockUser = {
      email: 'test@test.com',
      accessToken: 'fake-token',
      role: 3,
      id: 1,
      message: 'Success',
      name: 'Test User'
    };
    service['currentUserSubject'].next(mockUser);
    expect(service.validateAdminAccess()).toBeFalsy();
    expect(notificationServiceMock.warning).toHaveBeenCalledWith(
      'Acceso denegado: Se requieren permisos de administrador'
    );
  });

  it('should validate seller access', () => {
    const mockUser = {
      email: 'test@test.com',
      accessToken: 'fake-token',
      role: 3,
      id: 1,
      message: 'Success',
      name: 'Test User'
    };
    service['currentUserSubject'].next(mockUser);
    expect(service.validateSellerAccess()).toBeTruthy();
    expect(notificationServiceMock.warning).not.toHaveBeenCalled();
  });

  it('should deny seller access for non-seller users', () => {
    const mockUser = {
      email: 'test@test.com',
      accessToken: 'fake-token',
      role: 1,
      id: 1,
      message: 'Success',
      name: 'Test User'
    };
    service['currentUserSubject'].next(mockUser);
    expect(service.validateSellerAccess()).toBeFalsy();
    expect(notificationServiceMock.warning).toHaveBeenCalledWith(
      'Acceso denegado: Se requieren permisos de vendedor'
    );
  });
}); 