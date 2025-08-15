import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BuyerVisitService } from '@app/core/services/buyer-visit/buyer-visit.service';
import { BuyerVisitResponse } from '@app/core/models/buyer-visit.model';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-buyer-visits-list',
  templateUrl: './buyer-visits-list.component.html',
  styleUrls: ['./buyer-visits-list.component.scss']
})
export class BuyerVisitsListComponent implements OnInit, OnDestroy {
  visits: BuyerVisitResponse[] = [];
  loading = false;
  error = false;
  private destroy$ = new Subject<void>();

  constructor(
    private buyerVisitService: BuyerVisitService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadVisits();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVisits(): void {
    this.loading = true;
    this.error = false;

    // Usar el método GET que funciona correctamente
    this.buyerVisitService.getSellerPropertyVisits()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (visits: BuyerVisitResponse[]) => {
          this.visits = visits;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error loading visits:', error);
          this.error = true;
          this.loading = false;
          this.notificationService.error('Error al cargar las visitas');
        }
      });
  }

  cancelVisit(visitId: number): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta visita?')) {
      this.buyerVisitService.cancelVisit(visitId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.success('Visita cancelada exitosamente');
            this.loadVisits();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error canceling visit:', error);
            this.notificationService.error('Error al cancelar la visita');
          }
        });
    }
  }

  confirmVisit(visitId: number): void {
    if (confirm('¿Estás seguro de que deseas confirmar esta visita?')) {
      this.buyerVisitService.cancelVisit(visitId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.success('Visita confirmada exitosamente');
            this.loadVisits();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error confirming visit:', error);
            this.notificationService.error('Error al confirmar la visita');
          }
        });
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  }
} 