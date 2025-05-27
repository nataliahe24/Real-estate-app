import { TestBed } from '@angular/core/testing';
import { JwtService } from './jwt.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('JwtService', () => {
  let service: JwtService;
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6IlNFTExFUiIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JwtService]
    });
    service = TestBed.inject(JwtService);
    localStorage.clear();
    jest.clearAllMocks();

    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Token Management', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should save token to localStorage', () => {
      service.saveToken(mockToken);
      expect(localStorage.setItem).toHaveBeenCalledWith('jwtToken', mockToken);
    });

    it('should get token from localStorage', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(mockToken);
      const token = service.getToken();
      expect(localStorage.getItem).toHaveBeenCalledWith('jwtToken');
      expect(token).toBe(mockToken);
    });

    it('should destroy token from localStorage', () => {
      service.destroyToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith('jwtToken');
    });

    it('should return null when token is not set', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);
      const token = service.getToken();
      expect(token).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle error in saveToken', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const error = new Error('Storage error');
      jest.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw error;
      });

      expect(() => service.saveToken(mockToken)).toThrow(error);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
