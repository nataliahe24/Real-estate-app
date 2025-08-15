import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Visit } from '@core/models/visit.model';
import { BuyerVisitService } from '@core/services/buyer-visit/buyer-visit.service';
import { BuyerVisit } from '@core/models/buyer-visit.model';

interface VisitModalData {
  propertyId: number;
  propertyName: string;
  visits: Visit[];
}

@Component({
  selector: 'app-visit-modal',
  templateUrl: './visit-modal.component.html',
  styleUrls: ['./visit-modal.component.scss']
})
export class VisitModalComponent {
  visitForm: FormGroup;
  selectedVisitId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private buyerVisitService: BuyerVisitService,
    public dialogRef: MatDialogRef<VisitModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VisitModalData
  ) {
    this.visitForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  selectVisit(visitId: number): void {
    this.selectedVisitId = visitId;
  }

  onSubmit(): void {
    if (this.visitForm.valid && this.selectedVisitId) {
      this.loading = true;
      const buyerVisit: BuyerVisit = {
        scheduleId: this.selectedVisitId,
        buyerEmail: this.visitForm.get('email')?.value,
      };

      this.buyerVisitService.createBuyerVisit(buyerVisit).subscribe({
        next: (response) => {
          this.loading = false;
          this.dialogRef.close(response);
        },
        error: (error) => {
          this.loading = false;
          this.onCancel();
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 