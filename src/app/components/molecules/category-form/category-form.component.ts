import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent {
  @Output() submitForm = new EventEmitter<{name: string, description: string}>();
  
  categoryForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.required]
    });
  }
  
  onSubmit() {
    if (this.categoryForm.valid) {
      this.submitForm.emit(this.categoryForm.value);
      this.categoryForm.reset();
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
  
  onSkip() {
    this.categoryForm.reset();
  }
} 