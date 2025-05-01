import { TestBed } from '@angular/core/testing';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;
  let localStorageSpy: any;

  beforeEach(() => {
    localStorageSpy = {
      getItem: jasmine.createSpy('getItem'),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem')
    };
    
    spyOn(window.localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
    spyOn(window.localStorage, 'setItem').and.callFake(localStorageSpy.setItem);
    spyOn(window.localStorage, 'removeItem').and.callFake(localStorageSpy.removeItem);

    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get token from localStorage', () => {
    service.getToken();
    expect(localStorage.getItem).toHaveBeenCalledWith('jwtToken');
  });

  it('should save token to localStorage', () => {
    const token = 'test-token';
    service.saveToken(token);
    expect(localStorage.setItem).toHaveBeenCalledWith('jwtToken', token);
  });

  it('should remove token from localStorage', () => {
    service.destroyToken();
    expect(localStorage.removeItem).toHaveBeenCalledWith('jwtToken');
  });
}); 