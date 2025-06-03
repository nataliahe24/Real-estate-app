import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VisitService } from '@core/services/visit/visit.service';
import { Visit } from '@core/models/visit.model';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { VisitModalComponent } from '../../molecules/visit-modal/visit-modal.component';
import { NotificationService } from '@app/core/services/notifications/notification.service';

interface GroupedVisit {
  propertyId: number;
  propertyName: string;
  city: string;
  neighborhood: string;
  address: string;
  visits: Visit[];
}

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
  groupedVisits: GroupedVisit[] = [];

  propertyImages = [
    'assets/images/casa-2.png',
    'assets/images/casa-3.png',
    'assets/images/casa-4.png',
    'assets/images/casa-5.png'
  ];

  constructor(
    private fb: FormBuilder,
    private visitService: VisitService,
    private dialog: MatDialog,
    private notificationService: NotificationService
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
        this.groupVisitsByProperty();
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  private groupVisitsByProperty(): void {
    const grouped = this.visits.reduce((acc, visit) => {
      const existingGroup = acc.find(g => g.propertyId === visit.propertyId);
      
      if (existingGroup) {
        existingGroup.visits.push(visit);
      } else {
        acc.push({
          propertyId: visit.propertyId,
          propertyName: visit.propertyName,
          city: visit.city,
          neighborhood: visit.neighborhood,
          address: visit.address,
          visits: [visit]
        });
      }
      return acc;
    }, [] as GroupedVisit[]);

    this.groupedVisits = grouped;
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

  openVisitModal(group: GroupedVisit): void {
    const dialogRef = this.dialog.open(VisitModalComponent, {
      data: {
        propertyId: group.propertyId,
        propertyName: group.propertyName,
        visits: group.visits
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