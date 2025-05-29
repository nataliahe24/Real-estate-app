import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notifications/notification.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;
  let notificationServiceMock: jest.Mocked<NotificationService>;

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: jest.fn()
    } as any;

    routerMock = {
      navigate: jest.fn()
    } as any;

    notificationServiceMock = {
      warning: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NotificationService, useValue: notificationServiceMock }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    expect(guard.canActivate()).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(notificationServiceMock.warning).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to login when user is not authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    expect(guard.canActivate()).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    expect(notificationServiceMock.warning).toHaveBeenCalledWith('No tienes permisos para acceder a esta página');
  });
}); 