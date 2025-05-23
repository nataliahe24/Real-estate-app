import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, pipe, throwError } from 'rxjs';
import { PropertyResponse, PropertyFilter, PaginatedPropertiesResponse, Property, PropertyFilters } from '../../models/property.model';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ValidationPropertyFilter} from '@app/shared/utils/validators/validatePropertyFilter';


@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl: string;
 

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiUrlProperties}`;
  }

  getProperties(filters: { [key: string]: any } = {}): Observable<PropertyResponse[]> {
    let params = new HttpParams();

    if (filters['category'] && filters['category'] !== '') {
      params = params.append('category', filters['category']);
    }
    if (filters['location'] && filters['location'] !== '') {
      params = params.append('location', filters['location']);
    }
    
    params = params.append('page', '0');
    params = params.append('size', '20');
    params = params.append('orderAsc', 'true');
    

    return this.http.get<PaginatedPropertiesResponse>(`${environment.apiUrlProperties}list`, { params })
      .pipe(
        map((response: PaginatedPropertiesResponse) => response.content),
        catchError(error => {
          console.error('Error en la solicitud:', error);
          if (error.error) {
            console.error('Detalles del error:', error.error);
          }
          return throwError(() => error);
        })
      );
  }

  createProperty(property: Property): Observable<Property> {
    return this.http.post<Property>(`${this.apiUrl}/`, property).pipe(
      catchError(error => {
        console.error('Error creating property:', error);
        return throwError(() => error);
      })
    );
  }

  getFilteredProperties(filters: PropertyFilters): Observable<PaginatedPropertiesResponse> {
    let params = new HttpParams()
      .set('page', (filters.page || 0).toString())
      .set('size', (filters.size || 10).toString())
      .set('orderAsc', (filters.orderAsc ?? true).toString());

    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.location) params = params.set('location', filters.location);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.rooms) params = params.set('rooms', filters.rooms.toString());
    if (filters.bathrooms) params = params.set('bathrooms', filters.bathrooms.toString());
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());

    const url = `${this.apiUrl}?${params.toString()}`;
    console.log('Request URL:', url);
    console.log('Request Parameters:', params.toString());

    return this.http.get<PaginatedPropertiesResponse>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching filtered properties: ', error);
        return throwError(() => error);
      })
    );
  }
}