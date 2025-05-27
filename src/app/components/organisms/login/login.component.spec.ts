import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, FormBuilder } from '@angular/forms';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notifications/notification.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Component, forwardRef, Input, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({ selector: 'app-navbar', template: '' })
class MockNavbarComponent {
  @Input() menuItems: any;
  @Input() showLoginButton: boolean = false;
}

@Component({ selector: 'app-notification-container', template: '' })
class MockNotificationContainerComponent {}

@Component({
  selector: 'app-input',
  template: '<input [formControl]="control">',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MockInputComponent),
    multi: true
  }]
})
class MockInputComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() placeholder: string = '';
  @Input() formControlName: string = '';
  @Input() control: FormControl = new FormControl();
  writeValue(value: any): void { this.control.setValue(value); }
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState(isDisabled: boolean): void {}
}

@Component({
  selector: 'app-password-input',
  template: '<input [formControl]="control" type="password">',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MockPasswordInputComponent),
    multi: true
  }]
})
class MockPasswordInputComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() placeholder: string = '';
  @Input() formControlName: string = '';
  @Input() control: FormControl = new FormControl();
  writeValue(value: any): void { this.control.setValue(value); }
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState(isDisabled: boolean): void {}
}

@Component({ selector: 'app-button', template: '<button></button>' })
class MockButtonComponent {
  @Input() type: string = '';
  @Input() disabled: boolean = false;
  @Input() label: string = '';
  @Input() isSubmit: boolean = false;
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let notificationServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
      isAdmin: jest.fn(),
      isSeller: jest.fn()
    };
    notificationServiceMock = {
      success: jest.fn(),
      error: jest.fn()
    };
    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        LoginComponent,
        MockNavbarComponent,
        MockNotificationContainerComponent,
        MockInputComponent,
        MockPasswordInputComponent,
        MockButtonComponent
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not call login if form is invalid', () => {
    component.loginForm.setValue({ username: '', password: '' });
    component.onSubmit();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should call login and navigate to /wellcome-admin if isAdmin is true', () => {
    component.loginForm.setValue({ username: 'admin', password: '123456' });
    authServiceMock.login.mockReturnValue(of({ accessToken: 'token' }));
    authServiceMock.isAdmin.mockReturnValue(true);
    authServiceMock.isSeller.mockReturnValue(false);

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(notificationServiceMock.success).toHaveBeenCalledWith('Inicio de sesión exitoso');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/wellcome-admin']);
  });

  it('should call login and navigate to /wellcome-seller if isSeller is true', () => {
    component.loginForm.setValue({ username: 'seller', password: '123456' });
    authServiceMock.login.mockReturnValue(of({ accessToken: 'token' }));
    authServiceMock.isAdmin.mockReturnValue(false);
    authServiceMock.isSeller.mockReturnValue(true);

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(notificationServiceMock.success).toHaveBeenCalledWith('Inicio de sesión exitoso');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/wellcome-seller']);
  });

  it('should call login and navigate to /login if not admin or seller', () => {
    component.loginForm.setValue({ username: 'user', password: '123456' });
    authServiceMock.login.mockReturnValue(of({ accessToken: 'token' }));
    authServiceMock.isAdmin.mockReturnValue(false);
    authServiceMock.isSeller.mockReturnValue(false);

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(notificationServiceMock.success).toHaveBeenCalledWith('Inicio de sesión exitoso');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
