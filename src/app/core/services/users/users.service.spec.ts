import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { environment } from '@env/environment';
import { CreateUserDto } from '@core/models/user.model';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  const mockToken = 'mock-token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService]
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
    
    
    Storage.prototype.getItem = jest.fn(() => mockToken);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUser', () => {
    const mockUserData: CreateUserDto = {
      email: 'test@example.com',
      phoneNumber: '+1234567890',
      identityDocument: 123456789,
      birthDate: new Date('1990-01-01'),
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    };

    const mockResponse = {
      id: 1,
      ...mockUserData,
      role: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should create a user successfully', () => {
      service.createUser(mockUserData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}users/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      expect(req.request.body).toEqual({ ...mockUserData, role: 3 });
      req.flush(mockResponse);
    });

    it('should handle HTTP errors', () => {
      const errorResponse = { status: 400, statusText: 'Bad Request' };

      service.createUser(mockUserData).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}users/`);
      req.flush('Error', errorResponse);
    });
  });

  describe('validateUserData', () => {
    it('should throw error for invalid email format', () => {
      const invalidUserData: CreateUserDto = {
        email: 'invalid-email',
        phoneNumber: '+1234567890',
        identityDocument: 123456789,
        birthDate: new Date('1990-01-01'),
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      };

      expect(() => service.createUser(invalidUserData)).toThrow('Invalid email format');
    });

    it('should throw error for invalid phone number', () => {
      const invalidUserData: CreateUserDto = {
        email: 'test@example.com',
        phoneNumber: '123', 
        identityDocument: 123456789,
        birthDate: new Date('1990-01-01'),
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      };

      expect(() => service.createUser(invalidUserData)).toThrow('Phone number must be between 10 and 13 digits and may include +');
    });

    it('should throw error for invalid identity document', () => {
      const invalidUserData: CreateUserDto = {
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        identityDocument: 123456789.5, 
        birthDate: new Date('1990-01-01'),
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      };

      expect(() => service.createUser(invalidUserData)).toThrow('Identity document must contain only numbers');
    });

    it('should throw error for underage user', () => {
      const invalidUserData: CreateUserDto = {
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        identityDocument: 123456789,
        birthDate: new Date(),
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      };

      expect(() => service.createUser(invalidUserData)).toThrow('User must be at least 18 years old');
    });
  });
}); 