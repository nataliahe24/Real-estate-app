import { Component } from '@angular/core';
import { Visit } from '@core/models/visit.model';
import { VisitService } from '@core/services/visit/visit.service';


@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss']
})
export class VisitComponent {
  loading = false;

  constructor(private readonly visitService: VisitService) {}

  onVisitSubmit(visit: Visit): void {
    this.loading = true;
    this.visitService.createVisit(visit).subscribe({
      next: () => {
        this.loading = false;
        
      },
      error: (error) => {
        this.loading = false;

        console.error('Error creating visit:', error);
      }
    });
  }
}
