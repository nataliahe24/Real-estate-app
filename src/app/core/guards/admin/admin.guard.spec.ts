import { TestBed } from '@angular/core/testing';
import { AdminGuard } from '../admin.guard';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    authServiceMock = {
      isAdmin: jest.fn()
    } as any;

    routerMock = {
      navigate: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is admin', () => {
    authServiceMock.isAdmin.mockReturnValue(true);
    expect(guard.canActivate()).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to home when user is not admin', () => {
    authServiceMock.isAdmin.mockReturnValue(false);
    expect(guard.canActivate()).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
}); 