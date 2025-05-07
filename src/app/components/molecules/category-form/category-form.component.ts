import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { getCharacterInfo } from '@app/shared/helper/form-helper';
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
  readonly DESC_MAX_LENGTH = 200;
  readonly DESC_MIN_LENGTH = 10;

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {
    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)])
    });
  }

  createCategory(): void {
    if (this.categoryForm.invalid) {
      this.notificationService.warning('Por favor completa el formulario correctamente');
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
    this.categoryForm.reset();
  }
}
