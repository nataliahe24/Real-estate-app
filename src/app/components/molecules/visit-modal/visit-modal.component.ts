import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BuyerVisitService } from '@app/core/services/buyer-visit/buyer-visit.service';



interface VisitModalData {
  scheduleId: number;
  email: string;
}

@Component({
  selector: 'app-visit-modal',
  templateUrl: './visit-modal.component.html',
  styleUrls: ['./visit-modal.component.scss']
})
export class VisitModalComponent {
  visitForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<VisitModalComponent>,
    private readonly buyerVisitService: BuyerVisitService,
    @Inject(MAT_DIALOG_DATA) public data: VisitModalData
  ) {
    
    this.visitForm = this.fb.group({
      scheduleId: [data.scheduleId, [Validators.required]],
      email: [data.email, [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.visitForm.valid) {
      const visitData = {
        scheduleId: this.visitForm.value.scheduleId,
        buyerEmail: this.visitForm.value.email
      };
      
      this.buyerVisitService.createBuyerVisit(visitData).subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        },
        error: (error) => {
          this.dialogRef.close(error);
          console.error('Error al crear visita:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 