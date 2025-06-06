import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, CreateUserDto } from '@core/models/user.model';
import { environment } from '@env/environment';
import { NotificationService } from '@core/services/notifications/notification.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly API_URL = `${environment.apiUrlUsers}`;
  private readonly SELLER_ROLE_ID = 3;

  constructor(
    private readonly http: HttpClient,
    private readonly notificationService: NotificationService
  ) {}

  createUser(userData: CreateUserDto): Observable<User> {
    const userWithRole = {
      ...userData,
      role: this.SELLER_ROLE_ID
    };

    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post<User>(this.API_URL, userWithRole, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
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
          errorMessage = error.error?.message || 'No tiene permisos para realizar esta acción.';
          break;
        case 404:
          errorMessage = error.error?.message || 'No se encontró la información solicitada';
          break;
        case 409:
          errorMessage = 'Ya existe un usuario registrado con este correo electrónico';
          break;
        case 500:
          errorMessage = 'Error del servidor. Por favor, intente más tarde.';
          break;
        default:
          errorMessage = error.error?.message || error.message;
      }
    }

    this.notificationService.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 