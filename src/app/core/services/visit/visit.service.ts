import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Visit, VisitResponse, VisitQueryParams } from '@core/models/visit.model';
import { NotificationService } from '../notifications/notification.service';
import { MessageBundle } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private readonly apiUrl = environment.apiUrlVisits;

  constructor(
    private readonly http: HttpClient,
    private readonly notificationService: NotificationService
  ) {}

 
  createVisit(visit: Visit): Observable<Visit> {
    return this.http.post<Visit>(this.apiUrl, visit).pipe(
      map(response => {
        this.notificationService.success('Horario programado exitosamente');
        return response;
      }),
      catchError(this.handleError.bind(this))
    );
  }

 
  getVisits(params: VisitQueryParams): Observable<VisitResponse> {
    let httpParams = new HttpParams();
    
    if (params.startDate) {
      httpParams = httpParams.set('startDate', new Date(params.startDate).toISOString());
    }
    if (params.endDate) {
      httpParams = httpParams.set('endDate', new Date(params.endDate).toISOString());
    }
    if (params.location) {
      httpParams = httpParams.set('location', params.location);
    }
    
   
    httpParams = httpParams.set('page', '0');
    httpParams = httpParams.set('size', '10');

    console.log('Request URL:', `${this.apiUrl}?${httpParams.toString()}`);
    
    return this.http.get<VisitResponse>(this.apiUrl, { params: httpParams });
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = 'Error de conexión. Por favor, intente nuevamente.';
    } else {
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos. Por favor, verifique la información.';
          break;
        case 401:
          errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
          break;
        case 403:
          if (error.error?.message) {
            errorMessage = error.error?.message;
          }
          errorMessage = 'No tiene permisos para realizar esta acción.';
          break;
        case 404:
          if (error.error?.message) {
            errorMessage = error.error?.message;
          } else {
            errorMessage = 'No se encontró la información solicitada';
          }
          break;
        case 500:
          errorMessage = 'Error del servidor. Por favor, intente más tarde.';
          break;
        default:
          errorMessage = error.error?.message || `Error ${error.status}: ${error.message}`;
      }
    }

    this.notificationService.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 