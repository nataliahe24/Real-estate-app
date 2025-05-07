import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(this.NAME_MIN_LENGTH),
        Validators.maxLength(this.NAME_MAX_LENGTH)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(this.DESC_MIN_LENGTH),
        Validators.maxLength(this.DESC_MAX_LENGTH)
      ]]
    });
  }

  get nameInfo() {
    return getCharacterInfo(
      this.categoryForm.get('name'),
      this.NAME_MAX_LENGTH,
      this.NAME_MIN_LENGTH
    );
  }

  get descriptionInfo() {
    return getCharacterInfo(
      this.categoryForm.get('description'),
      this.DESC_MAX_LENGTH,
      this.DESC_MIN_LENGTH
    );
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
