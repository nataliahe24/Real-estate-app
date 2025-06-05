import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoutButtonComponent } from './logout-button.component';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notifications/notification.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LogoutButtonComponent', () => {
  let component: LogoutButtonComponent;
  let fixture: ComponentFixture<LogoutButtonComponent>;
  let authServiceMock: any;
  let notificationServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      logout: jest.fn(),
      purgeAuth: jest.fn()
    };
    notificationServiceMock = {
      success: jest.fn(),
      error: jest.fn()
    };
    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [LogoutButtonComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call onLogout when "logout" is selected', () => {
    authServiceMock.logout.mockReturnValue(of({}));
    component.onLogout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should navigate to /login when "logout" is selected', () => {
    component.onLogout();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show success notification and navigate to /login on successful logout', () => {
    authServiceMock.logout.mockReturnValue(of({}));
    component.onLogout();
    expect(notificationServiceMock.success).toHaveBeenCalledWith('Sesión cerrada exitosamente');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
}); 