import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersFormComponent } from './users-form.component';
import { UsersService } from '@core/services/users/users.service';
import { NotificationService } from '@core/services/notifications/notification.service';
import { of, throwError } from 'rxjs';
import { InputComponent } from '../../../components/atoms/input/input.component';
import { ButtonComponent } from '../../../components/atoms/button/button.component';

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
        ButtonComponent
      ],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersFormComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService) as jest.Mocked<UsersService>;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with empty values', () => {
      expect(component.userForm.get('firstName')?.value).toBe('');
      expect(component.userForm.get('lastName')?.value).toBe('');
      expect(component.userForm.get('identityDocument')?.value).toBe('');
      expect(component.userForm.get('phoneNumber')?.value).toBe('');
      expect(component.userForm.get('birthDate')?.value).toBe('');
      expect(component.userForm.get('email')?.value).toBe('');
      expect(component.userForm.get('password')?.value).toBe('');
    });

    it('should have all required validators', () => {
      const form = component.userForm;
      expect(form.get('firstName')?.hasValidator(Validators.required)).toBeTruthy();
      expect(form.get('lastName')?.hasValidator(Validators.required)).toBeTruthy();
      expect(form.get('identityDocument')?.hasValidator(Validators.required)).toBeTruthy();
      expect(form.get('phoneNumber')?.hasValidator(Validators.required)).toBeTruthy();
      expect(form.get('birthDate')?.hasValidator(Validators.required)).toBeTruthy();
      expect(form.get('email')?.hasValidator(Validators.required)).toBeTruthy();
      expect(form.get('password')?.hasValidator(Validators.required)).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should validate email format', () => {
      const emailControl = component.userForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalsy();
      expect(emailControl?.errors?.['email']).toBeTruthy();
    });

    it('should validate phone number format', () => {
      const phoneControl = component.userForm.get('phoneNumber');
      phoneControl?.setValue('123'); // Too short
      expect(phoneControl?.valid).toBeFalsy();
      expect(phoneControl?.errors?.['pattern']).toBeTruthy();
    });

    it('should validate identity document format', () => {
      const idControl = component.userForm.get('identityDocument');
      idControl?.setValue('123abc'); // Contains letters
      expect(idControl?.valid).toBeFalsy();
      expect(idControl?.errors?.['pattern']).toBeTruthy();
    });

    it('should validate password minimum length', () => {
      const passwordControl = component.userForm.get('password');
      passwordControl?.setValue('123'); // Too short
      expect(passwordControl?.valid).toBeFalsy();
      expect(passwordControl?.errors?.['minlength']).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    const validFormData = {
      firstName: 'John',
      lastName: 'Doe',
      identityDocument: '1234567890',
      phoneNumber: '+573005698325',
      birthDate: '1990-01-01',
      email: 'test@example.com',
      password: 'password123'
    };

    it('should not submit if form is invalid', () => {
      component.onSubmit();
      expect(usersService.createUser).not.toHaveBeenCalled();
    });

    it('should submit form and show success message on success', () => {
      mockUsersService.createUser.mockReturnValue(of({}));
      component.userForm.patchValue(validFormData);
      
      component.onSubmit();

      expect(usersService.createUser).toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalledWith('Usuario creado correctamente');
      expect(component.userForm.pristine).toBeTruthy();
    });

    it('should show error message when user already exists', () => {
      mockUsersService.createUser.mockReturnValue(throwError(() => ({ status: 400 })));
      component.userForm.patchValue(validFormData);
      
      component.onSubmit();

      expect(notificationService.error).toHaveBeenCalledWith('Usuario ya existe');
    });
  });
}); 