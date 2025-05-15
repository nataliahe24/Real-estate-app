import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '@core/services/users/users.service';
import { CreateUserDto } from '@core/models/user.model';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss']
})
export class UsersFormComponent implements OnInit {
  userForm!: FormGroup;
  minDate: Date;
  maxDate: Date;

  constructor(
    private readonly fb: FormBuilder,
    private readonly usersService: UsersService
  ) {
    this.minDate = new Date(1900, 0, 1);
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      identityDocument: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{10,13}$')]],
      birthDate: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;
    if (errors['required']) {
      return 'Este campo es requerido';
    }
    if (errors['email']) {
      return 'Ingrese un correo electrónico válido';
    }
    if (errors['minlength']) {
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }
    if (errors['pattern']) {
      if (controlName === 'phoneNumber') {
        return 'Ingrese un número de teléfono válido (+573005698325)';
      }
      if (controlName === 'identityDocument') {
        return 'Solo se permiten números';
      }
    }
    return 'Campo inválido';
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: CreateUserDto = {
        ...this.userForm.value,
        birthDate: new Date(this.userForm.value.birthDate)
      };

      this.usersService.createUser(userData).subscribe({
        next: () => {
          this.userForm.reset();
          // TODO: Add success notification
        },
        error: (error) => {
          console.error('Error creating user:', error);
          // TODO: Add error notification
        }
      });
    }
  }
}
