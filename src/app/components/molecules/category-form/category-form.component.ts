import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CategoryService } from '../../../core/services/categories/category.service';
import { NotificationService } from '../../../core/services/notifications/notification.service';
import { validateCategory } from '../../../shared/utils/validators/validateCategory';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent {
  @Output() submitForm = new EventEmitter<{ name: string, description: string }>();

  categoryForm: FormGroup;

  readonly NAME_MAX_LENGTH = 50;
  readonly NAME_MIN_LENGTH = 3;
  readonly DESC_MAX_LENGTH = 90;
  readonly DESC_MIN_LENGTH = 10;

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {
    this.categoryForm = new FormGroup({
      name: new FormControl('', [
        Validators.required, 
        Validators.minLength(this.NAME_MIN_LENGTH), 
        Validators.maxLength(this.NAME_MAX_LENGTH)
      ]),
      description: new FormControl('', [
        Validators.required, 
        Validators.minLength(this.DESC_MIN_LENGTH), 
        Validators.maxLength(this.DESC_MAX_LENGTH)
      ])
    });
  }

  get nameInfo() {
    const nameControl = this.categoryForm.get('name');
    const currentLength = nameControl?.value?.length || 0;
    const remainingChars = this.NAME_MAX_LENGTH - currentLength;
    const isValid = nameControl?.valid;
    const isDirty = nameControl?.dirty;

    return {
      currentLength,
      remainingChars,
      isValid,
      isDirty,
      minLength: this.NAME_MIN_LENGTH,
      maxLength: this.NAME_MAX_LENGTH
    };
  }

  get descriptionInfo() {
    const descControl = this.categoryForm.get('description');
    const currentLength = descControl?.value?.length || 0;
    const remainingChars = this.DESC_MAX_LENGTH - currentLength;
    const isValid = descControl?.valid;
    const isDirty = descControl?.dirty;

    return {
      currentLength,
      remainingChars,
      isValid,
      isDirty,
      minLength: this.DESC_MIN_LENGTH,
      maxLength: this.DESC_MAX_LENGTH
    };
  }

  createCategory(): void {
    if (this.categoryForm.invalid) {
      const nameControl = this.categoryForm.get('name');
      const descControl = this.categoryForm.get('description');

      if (nameControl?.errors) {
        if (nameControl.errors['required']) {
          this.notificationService.warning('El nombre es requerido');
        } else if (nameControl.errors['minlength']) {
          this.notificationService.warning(
            `El nombre debe tener al menos ${this.NAME_MIN_LENGTH} caracteres`
          );
        } else if (nameControl.errors['maxlength']) {
          this.notificationService.warning(
            `El nombre no puede exceder ${this.NAME_MAX_LENGTH} caracteres`
          );
        }
      }

      if (descControl?.errors) {
        if (descControl.errors['required']) {
          this.notificationService.warning('La descripción es requerida');
        } else if (descControl.errors['minlength']) {
          this.notificationService.warning(
            `La descripción debe tener al menos ${this.DESC_MIN_LENGTH} caracteres`
          );
        } else if (descControl.errors['maxlength']) {
          this.notificationService.warning(
            `La descripción no puede exceder ${this.DESC_MAX_LENGTH} caracteres`
          );
        }
      }
      return;
    }

    const newCategory = this.categoryForm.value;

    if (!validateCategory(newCategory, this.notificationService)) {
      return;
    }

    this.categoryService.createCategory(newCategory).subscribe({
      next: () => {
        this.notificationService.success('Categoría creada con éxito');
        this.categoryForm.reset();
        this.submitForm.emit(newCategory);
      },
      error: () => {
        this.notificationService.error('La categoría ya existe');
      }
    });
  }

  onSkip(): void {
    this.notificationService.info('Formulario cancelado');
    this.categoryForm.reset();
  }
}
