import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CategoryService } from '../../../core/services/categories/category.service';
import { NotificationService } from '../../../core/services/notifications/notification.service';

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
      this.notificationService.warning('Por favor, complete correctamente todos los campos');
      return;
    }

    const newCategory = this.categoryForm.value;

    this.categoryService.createCategory(newCategory).subscribe({
      next: () => {
        this.notificationService.success('Categoría creada con éxito');
        this.categoryForm.reset();
        this.submitForm.emit(newCategory);
      },
      error: (error) => {
        this.notificationService.error(error.message);
      }
    });
  }

  onSkip(): void {
    this.notificationService.info('Formulario cancelado');
    this.categoryForm.reset();
  }
}
