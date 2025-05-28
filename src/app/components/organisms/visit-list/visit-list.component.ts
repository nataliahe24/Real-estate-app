import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VisitService } from '@core/services/visit/visit.service';
import { Visit } from '@core/models/visit.model';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  private destroy$ = new Subject<void>();

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
    this.visitForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadVisits();
      });

    this.loadVisits();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  

  loadVisits(): void {
    this.loading = true;
    this.error = false;

    const formValues = {
      ...this.visitForm.value,
      location: this.visitForm.value.location?.trim() || '',
      page: this.currentPage - 1, 
      size: this.pageSize
    };

    this.visitService.getVisits(formValues).subscribe({
      next: (response) => {
        this.visits = response.content;
        this.totalPages = response.totalPages;
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

  onPageChange(page: number): void {
    if (page === this.currentPage) return;
    this.currentPage = page;
    this.loadVisits();
  }

  resetFilters(): void {
    this.visitForm.reset({
      startDate: '',
      endDate: '',
      location: ''
    });
    this.currentPage = 1;
    this.loadVisits();
  }
} 