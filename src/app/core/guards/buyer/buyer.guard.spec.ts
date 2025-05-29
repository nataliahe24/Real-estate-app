import { TestBed } from '@angular/core/testing';
import { BuyerGuard } from '../buyer.guard';
import { AuthService } from '../../services/auth/auth.service';

describe('BuyerGuard', () => {
  let guard: BuyerGuard;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(() => {
    authServiceMock = {
      isBuyer: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        BuyerGuard,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    guard = TestBed.inject(BuyerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is buyer', () => {
    authServiceMock.isBuyer.mockReturnValue(true);
    expect(guard.canActivate()).toBe(true);
  });

  it('should deny access when user is not buyer', () => {
    authServiceMock.isBuyer.mockReturnValue(false);
    expect(guard.canActivate()).toBe(false);
  });
}); 