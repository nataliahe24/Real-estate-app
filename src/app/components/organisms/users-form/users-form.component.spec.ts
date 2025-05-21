import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersFormComponent } from './users-form.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UsersService } from '@core/services/users/users.service';
import { NotificationService } from '@core/services/notifications/notification.service';
import { of, throwError } from 'rxjs';
import { MOCK_USER } from '@app/shared/utils/constants/mock-user';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@app/components/atoms/input/input.component';
import { ButtonComponent } from '@app/components/atoms/button/button.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PasswordInputComponent } from '@app/components/atoms/password-input/password-input.component';

describe('UsersFormComponent', () => {
  let component: UsersFormComponent;
  let fixture: ComponentFixture<UsersFormComponent>;
  let usersService: jest.Mocked<UsersService>;
  let notificationService: jest.Mocked<NotificationService>;

  const mockUsersService = {
    createUser: jest.fn()
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        UsersFormComponent,
        InputComponent,
        ButtonComponent,
        PasswordInputComponent
      ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: UsersService, useValue: mockUsersService },
        { provide: NotificationService, useValue: mockNotificationService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersFormComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService) as jest.Mocked<UsersService>;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize with empty form', () => {
      fixture.detectChanges();
      expect(component.userForm).toBeTruthy();
      expect(component.userForm.get('firstName')?.value).toBe('');
      expect(component.userForm.get('lastName')?.value).toBe('');
      expect(component.userForm.get('identityDocument')?.value).toBe('');
      expect(component.userForm.get('phoneNumber')?.value).toBe('');
      expect(component.userForm.get('birthDate')?.value).toBe('');
      expect(component.userForm.get('email')?.value).toBe('');
      expect(component.userForm.get('password')?.value).toBe('');
    });

    it('should set date constraints', () => {
      fixture.detectChanges();
      expect(component.minDate).toEqual(new Date(1900, 0, 1));
      const today = new Date();
      const maxDate = component.maxDate;
      expect(maxDate.getFullYear()).toBe(today.getFullYear());
      expect(maxDate.getMonth()).toBe(today.getMonth());
      expect(maxDate.getDate()).toBe(today.getDate());
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate required fields', () => {
      const form = component.userForm;
      expect(form.valid).toBeFalsy();
      expect(form.get('firstName')?.errors?.['required']).toBeTruthy();
      expect(form.get('lastName')?.errors?.['required']).toBeTruthy();
      expect(form.get('identityDocument')?.errors?.['required']).toBeTruthy();
      expect(form.get('phoneNumber')?.errors?.['required']).toBeTruthy();
      expect(form.get('birthDate')?.errors?.['required']).toBeTruthy();
      expect(form.get('email')?.errors?.['required']).toBeTruthy();
      expect(form.get('password')?.errors?.['required']).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.userForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.errors?.['email']).toBeTruthy();
      
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.errors?.['email']).toBeFalsy();
    });

    it('should validate phone number format', () => {
      const phoneControl = component.userForm.get('phoneNumber');
      phoneControl?.setValue('1234567890');
      expect(phoneControl?.errors?.['pattern']).toBeTruthy();
      
      phoneControl?.setValue('+573001234567');
      expect(phoneControl?.errors?.['pattern']).toBeFalsy();
    });

    it('should validate identity document format', () => {
      const docControl = component.userForm.get('identityDocument');
      docControl?.setValue('ABC123');
      expect(docControl?.errors?.['pattern']).toBeTruthy();
      
      docControl?.setValue('1234567890');
      expect(docControl?.errors?.['pattern']).toBeFalsy();
    });

    it('should validate password length', () => {
      const passwordControl = component.userForm.get('password');
      passwordControl?.setValue('123');
      expect(passwordControl?.errors?.['minlength']).toBeTruthy();
      
      passwordControl?.setValue('password123');
      expect(passwordControl?.errors?.['minlength']).toBeFalsy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.userForm.patchValue(MOCK_USER);
    });

    it('should submit valid form successfully', () => {
      mockUsersService.createUser.mockReturnValue(of({}));
      
      component.onSubmit();
      
      expect(usersService.createUser).toHaveBeenCalledWith({
        ...MOCK_USER,
        birthDate: expect.any(Date)
      });
      expect(notificationService.success).toHaveBeenCalledWith('Usuario creado correctamente');
      expect(component.userForm.pristine).toBeTruthy();
    });

    it('should handle existing user error', () => {
      mockUsersService.createUser.mockReturnValue(
        throwError(() => ({ message: 'El usuario ya existe' }))
      );
      
      component.onSubmit();
      
      expect(notificationService.error).toHaveBeenCalledWith('Usuario ya existe');
    });
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render input components', () => {
      const compiled = fixture.nativeElement;
      const inputs = compiled.querySelectorAll('app-input');
      const passwordInput = compiled.querySelectorAll('app-password-input');
      expect(inputs.length + passwordInput.length).toBe(7);
    });

    it('should render submit button', () => {
      const compiled = fixture.nativeElement;
      const button = compiled.querySelector('app-button');
      expect(button).toBeTruthy();
    });


    it('should enable submit button when form is valid', () => {
      component.userForm.patchValue(MOCK_USER);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const button = compiled.querySelector('app-button');
      expect(button.getAttribute('disabled')).toBeNull();
    });
  });
});