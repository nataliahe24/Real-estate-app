import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Visit } from '@core/models/visit.model';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
  selector: 'app-visit-form',
  templateUrl: './visit-form.component.html',
  styleUrls: ['./visit-form.component.scss']
})
export class VisitFormComponent {
  @Input() loading = false;
  @Output() visitSubmit = new EventEmitter<Visit>();
  currentUserId = this.authService.getCurrentUser()?.id ?? null;

  visitForm: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthService) {
    this.currentUserId = this.authService.getCurrentUser()?.id ?? null;
    this.visitForm = this.fb.group({
      sellerId: [this.currentUserId, [Validators.required]],
      propertyId: ['', [Validators.required]],
      startDate: ['', [Validators.required, this.dateInPastValidator()]],
      endDate: ['', [Validators.required]]
    });

    this.visitForm.get('startDate')?.valueChanges.subscribe(startDate => {
      const endDateControl = this.visitForm.get('endDate');
      if (startDate) {
        endDateControl?.setValidators([
          Validators.required,
          this.endDateValidator(startDate)
        ]);
        endDateControl?.updateValueAndValidity();
        if (endDateControl?.value && new Date(endDateControl.value) <= new Date(startDate)) {
          endDateControl.setValue('');
        }
      }
    });

    this.visitForm.get('sellerId')?.setValue(this.authService.getCurrentUser()?.id ?? null);
  }

  private dateInPastValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate < today ? { dateInPast: true } : null;
    };
  }

  private endDateValidator(startDate: string): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !startDate) return null;
      const endDate = new Date(control.value);
      const start = new Date(startDate);
      return endDate <= start ? { endDateBeforeStart: true } : null;
    };
  }

  onSubmit(): void {
    if (this.visitForm.valid) {
      this.visitSubmit.emit(this.visitForm.value);
      this.resetForm();
    }
  }

  resetForm(): void {
    this.visitForm.reset();
    this.visitForm.get('sellerId')?.setValue(this.currentUserId);  
  }
} 