import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { NotificationService } from '../notifications/notification.service';
import { BuyerVisit } from '@app/core/models/buyer-visit.model';

@Injectable({
  providedIn: 'root'
})
export class BuyerVisitService {
    private apiUrl = environment.apiUrlBuyerVisit;
    
  

  constructor(
    private readonly http: HttpClient,
    private readonly notificationService: NotificationService
  ) {}

  createBuyerVisit(buyerVisit: BuyerVisit): Observable<any> {
    

    return this.http.post(this.apiUrl, buyerVisit).pipe(
      map(response => {
        this.notificationService.success('Visita programada exitosamente');
        return response;
      }),
      catchError(this.handleError.bind(this))
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
