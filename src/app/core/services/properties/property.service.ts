import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, pipe, throwError } from 'rxjs';
import { PropertyResponse, PropertyFilter, PaginatedPropertiesResponse, Property, PropertyFilters } from '../../models/property.model';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ValidationPropertyFilter} from '@app/shared/utils/validators/validate-property-filter';
import { AuthService } from '@core/services/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl: string;
 

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.apiUrl = environment.apiUrlProperties;
  }


  createProperty(property: Property): Observable<Property> {
    return this.http.post<Property>(this.apiUrl, property).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getFilteredProperties(filters: PropertyFilters): Observable<PaginatedPropertiesResponse> {
    let params = new HttpParams()
      .set('page', (filters.page || 0).toString())
      .set('size', (filters.size || 10).toString())
      .set('orderAsc', (filters.orderAsc ?? true).toString())
      .set('sortBy', filters.sortBy || 'price');
    
    if (filters.sellerId) params = params.set('sellerId', filters.sellerId.toString());
    if (filters.location) params = params.set('location', filters.location);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.rooms) params = params.set('rooms', filters.rooms.toString());
    if (filters.bathrooms) params = params.set('bathrooms', filters.bathrooms.toString());
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());

    const url = `${this.apiUrl}?${params.toString()}`;
    console.log('Request URL:', url);

    return this.http.get<PaginatedPropertiesResponse>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching filtered properties: ', error);
        return throwError(() => error);
      })
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
        case 500:
          errorMessage = 'Error del servidor. Por favor, intente más tarde.';
          break;
        default:
          errorMessage = error.error?.message || error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}