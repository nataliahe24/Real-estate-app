import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PropertyResponse } from '../../../core/models/property.model';
import { VisitModalComponent } from '../visit-modal/visit-modal.component';
import { Visit } from '../../../core/models/visit.model';

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.scss']
})
export class PropertyCardComponent implements OnChanges {
  @Input() property!: PropertyResponse;
  @Input() visits: Visit[] = [];
  
  type = 'Venta';
  propertyImages = [
    'assets/images/casa-2.png',
    'assets/images/casa-3.png',
    'assets/images/casa-4.png',
    'assets/images/casa-5.png'
  ];

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
   
  }

  openVisitModal(): void {
    if (this.visits && this.visits.length > 0) {
      const dialogRef = this.dialog.open(VisitModalComponent, {
        data: {
          propertyId: this.property.id,
          propertyName: this.property.name,
          visits: this.visits
        },
        width: '500px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          console.log('Visita confirmada:', result);
        }
      });
    }
  }

  hasAvailableVisits(): boolean {
    return this.visits && this.visits.length > 0;
  }
} 