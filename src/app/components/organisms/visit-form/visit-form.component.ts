import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Visit } from '@core/models/visit.model';
import { AuthService } from '@core/services/auth/auth.service';
import { dateInPastValidator, maxDateValidator, endDateValidator } from '@app/shared/utils/validators/validators-visit';

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
      startDate: ['', [Validators.required, dateInPastValidator(), maxDateValidator(21)]],
      endDate: ['', [Validators.required, maxDateValidator(21)]]
    });

    this.visitForm.get('startDate')?.valueChanges.subscribe(startDate => {
      const endDateControl = this.visitForm.get('endDate');
      if (startDate) {
        endDateControl?.setValidators([
          Validators.required,
          maxDateValidator(21),
          endDateValidator(startDate)
        ]);
        endDateControl?.updateValueAndValidity();
        if (endDateControl?.value && new Date(endDateControl.value) <= new Date(startDate)) {
          endDateControl.setValue('');
        }
      }
    });

    this.visitForm.get('sellerId')?.setValue(this.authService.getCurrentUser()?.id ?? null);
  }

  onSubmit(): void {
    if (this.visitForm.valid) {
      this.visitSubmit.emit(this.visitForm.value);
      this.resetForm();
    }
  }

  resetForm(): void {
    this.visitForm.reset();
    this.visitForm.patchValue({
      propertyId: null,
      startDate: '',
      endDate: ''
    });
    this.visitForm.get('sellerId')?.setValue(this.authService.getCurrentUser()?.id ?? null);
  }

  onPropertySelected(propertyId: number): void {
    this.visitForm.patchValue({ propertyId });
  }
} 