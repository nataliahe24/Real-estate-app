import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '@core/services/users/users.service';
import { CreateUserDto } from '@core/models/user.model';
import { NotificationService } from '@core/services/notifications/notification.service';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss']
})
export class UsersFormComponent implements OnInit {
  userForm!: FormGroup;
  minDate: Date;
  maxDate: Date;

  readonly PHONE_NUMBER_MIN_LENGTH = 10;
  readonly PHONE_NUMBER_MAX_LENGTH = 13;
  readonly IDENTITY_DOCUMENT_MIN_LENGTH = 7;
  readonly IDENTITY_DOCUMENT_MAX_LENGTH = 13;
  readonly PASSWORD_MIN_LENGTH = 8;
  readonly FIRST_NAME_MIN_LENGTH = 2;
  readonly LAST_NAME_MIN_LENGTH = 2;


  phoneNumberInfo = {
    currentLength: 0,
    maxLength: this.PHONE_NUMBER_MAX_LENGTH,
    minLength: this.PHONE_NUMBER_MIN_LENGTH,
    isValid: true,
    isDirty: false
  };

  identityDocumentInfo = {
    currentLength: 0,
    maxLength: this.IDENTITY_DOCUMENT_MAX_LENGTH,
    minLength: this.IDENTITY_DOCUMENT_MIN_LENGTH,
    isValid: true,
    isDirty: false
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService
  ) {
    this.minDate = new Date(1900, 0, 1);
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [
        Validators.required, 
        Validators.minLength(this.FIRST_NAME_MIN_LENGTH)]],

      lastName: ['', [
        Validators.required, 
        Validators.minLength(this.LAST_NAME_MIN_LENGTH)]],

      identityDocument: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]+$'), 
        Validators.minLength(this.IDENTITY_DOCUMENT_MIN_LENGTH), 
        Validators.maxLength(this.IDENTITY_DOCUMENT_MAX_LENGTH)]],

      phoneNumber: ['', [
        Validators.required, 
        Validators.pattern('^\\+[0-9]{10,13}$'),
        Validators.minLength(this.PHONE_NUMBER_MIN_LENGTH),
        Validators.maxLength(this.PHONE_NUMBER_MAX_LENGTH)
      ]],

      birthDate: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(this.PASSWORD_MIN_LENGTH)]]
    });
  }


  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: CreateUserDto = {
        ...this.userForm.value,
        birthDate: new Date(this.userForm.value.birthDate)
      };

      this.usersService.createUser(userData).subscribe({
        next: () => {
          this.notificationService.success('Usuario creado correctamente');
          this.userForm.reset();
        },
        complete: () => {
          this.notificationService.warning('Complete el formulario correctamente');
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.notificationService.error('Usuario ya existe');
          ;
          
        }
      });
    }
  }
}
