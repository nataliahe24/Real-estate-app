import { TestBed } from '@angular/core/testing';
import { SellerGuard } from './seller.guard';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

describe('SellerGuard', () => {
  let guard: SellerGuard;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    authServiceMock = {
      isSeller: jest.fn()
    } as any;

    routerMock = {
      navigate: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        SellerGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(SellerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is seller', () => {
    authServiceMock.isSeller.mockReturnValue(true);
    expect(guard.canActivate()).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to home when user is not seller', () => {
    authServiceMock.isSeller.mockReturnValue(false);
    expect(guard.canActivate()).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
}); 