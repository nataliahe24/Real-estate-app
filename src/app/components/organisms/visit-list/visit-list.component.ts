import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VisitService } from '@core/services/visit/visit.service';
import { Visit } from '@core/models/visit.model';

@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.scss']
})
export class VisitListComponent implements OnInit {
  visitForm: FormGroup;
  visits: Visit[] = [];
  loading = false;
  error = false;
  propertyImages = [
    'assets/images/casa-2.png',
    'assets/images/casa-3.png',
    'assets/images/casa-4.png',
    'assets/images/casa-5.png'
  ];

  constructor(
    private fb: FormBuilder,
    private visitService: VisitService
  ) {
    this.visitForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      location: ['']
    });
  }

  ngOnInit(): void {
    this.loadVisits();
  }

  loadVisits(): void {
    this.loading = true;
    this.error = false;
    console.log('Form values:', this.visitForm.value);
    this.visitService.getVisits(this.visitForm.value).subscribe({
      next: (response) => {
        this.visits = response.content;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  onSubmit(): void {
    this.loadVisits();
  }
} 