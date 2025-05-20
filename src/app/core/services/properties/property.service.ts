import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, pipe, throwError } from 'rxjs';
import { PropertyResponse, PropertyFilter, PaginatedPropertiesResponse, Property } from '../../models/property.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrlProperties;
    
    this.apiUrl = `${this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl}/list`;
    
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
    

    return this.http.get<PaginatedPropertiesResponse>(this.apiUrl, { params })
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
    return this.http.post<Property>(`${environment.apiUrlProperties}/`, property);
  }
}