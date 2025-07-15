import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { NotificationService } from '../notifications/notification.service';
import { BuyerVisit, BuyerVisitResponse } from '@app/core/models/buyer-visit.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BuyerVisitService {
    private apiUrl = environment.apiUrlBuyerVisit;
    
  

  constructor(
    private readonly http: HttpClient,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService
  ) {}

  getBuyerVisits(): Observable<BuyerVisitResponse[]> {
    const buyerEmail = this.authService.getCurrentUser()?.email;
    if (!buyerEmail) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return this.http.get<BuyerVisitResponse[]>(`${this.apiUrl}?buyerEmail=${encodeURIComponent(buyerEmail)}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getSellerPropertyVisits(): Observable<BuyerVisitResponse[]> {
    const sellerEmail = this.authService.getCurrentUser()?.email;
    if (!sellerEmail) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    // Usar el mismo endpoint pero con parámetro sellerEmail
    return this.http.get<BuyerVisitResponse[]>(`${this.apiUrl}?sellerEmail=${encodeURIComponent(sellerEmail)}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  createBuyerVisit(buyerVisit: BuyerVisit): Observable<any> {
    return this.http.post(this.apiUrl, buyerVisit).pipe(
      map(response => {
        this.notificationService.success('Visita programada exitosamente');
        return response;
      }),
      catchError(this.handleError.bind(this))
    );
  }

  cancelVisit(visitId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}cancel?visitId=${visitId}`).pipe(
      map(() => {
        this.notificationService.success('Visita cancelada exitosamente');
        return { success: true };
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 200) {

          return of({ success: true });
        }
        return this.handleError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = 'Error de conexión. Por favor, intente nuevamente.';
    } else {
      switch (error.status) {
        case 403:
          errorMessage = error.error?.message || 'No tienes permisos para realizar esta acción';
          break;
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos';
          break;
        case 500:
          errorMessage = error.error?.message || 'Error del servidor';
          break;
        default:
          errorMessage = error.error?.message || `Error ${error.status}`;
      }
    }

    this.notificationService.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
