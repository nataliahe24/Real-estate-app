import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let jwtService: JwtService;
  const apiUrl = `${environment.userApiUrl}/auth/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, JwtService]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    jwtService = TestBed.inject(JwtService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should authenticate user and store token', () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const mockUser = {
        email: 'test@example.com',
        username: 'testuser',
        token: 'jwt-token'
      };

      spyOn(jwtService, 'saveToken');

      service.login(credentials).subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(jwtService.saveToken).toHaveBeenCalledWith(mockUser.token);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush({ user: mockUser });
    });
  });

  describe('register', () => {
    it('should register user and store token', () => {
      const userData = { 
        username: 'testuser', 
        email: 'test@example.com', 
        password: 'password' 
      };
      const mockUser = {
        email: 'test@example.com',
        username: 'testuser',
        token: 'jwt-token'
      };

      spyOn(jwtService, 'saveToken');

      service.register(userData).subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(jwtService.saveToken).toHaveBeenCalledWith(mockUser.token);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush({ user: mockUser });
    });
  });

  describe('logout', () => {
    it('should remove token on logout', () => {
      spyOn(jwtService, 'destroyToken');

      service.logout().subscribe();

      const req = httpMock.expectOne(`${apiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      req.flush({});
      
      expect(jwtService.destroyToken).toHaveBeenCalled();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      // Manually set a user in the service
      (service as any).currentUserSubject.next({ username: 'test' });
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      // Ensure no user is set
      (service as any).currentUserSubject.next(null);
      expect(service.isAuthenticated()).toBe(false);
    });
  });
}); 