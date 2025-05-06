import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyResponse, PropertyFilter } from '../../models/property.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = `${environment.apiUrl}properties/`;

  constructor(private http: HttpClient) { }

  getProperties(filters: { [key: string]: any } = {}): Observable<PropertyResponse[]> {
    let params = new HttpParams();

    // Accede a las propiedades usando la notación de corchetes
    if (filters['category']) {
      params = params.append('category', filters['category']);
    }
    if (filters['location']) {
      params = params.append('location', filters['location']);
    }
    if (filters['rooms']) {
      params = params.append('rooms', filters['rooms'].toString());
    }
    if (filters['bathrooms']) {
      params = params.append('bathrooms', filters['bathrooms'].toString());
    }
    if (filters['minPrice']) {
      params = params.append('minPrice', filters['minPrice'].toString());
    }
    if (filters['maxPrice']) {
      params = params.append('maxPrice', filters['maxPrice'].toString());
    }
    if (filters['sortBy']) {
      params = params.append('sortBy', filters['sortBy']);
    }
    if (filters['orderAsc'] !== undefined) {
      params = params.append('orderAsc', filters['orderAsc'].toString());
    }

    return this.http.get<PropertyResponse[]>(this.apiUrl, { params });
  }

  getPropertyById(id: number): Observable<PropertyResponse> {
    return this.http.get<PropertyResponse>(`${this.apiUrl}/${id}`);
  }

  getPropertiesByLocation(locationId: number): Observable<PropertyResponse[]> {
    return this.http.get<PropertyResponse[]>(`${this.apiUrl}/location/${locationId}`);
  }

  getPropertiesBySeller(sellerId: number): Observable<PropertyResponse[]> {
    return this.http.get<PropertyResponse[]>(`${this.apiUrl}/seller/${sellerId}`);
  }

  getPropertiesByCategory(category: string): Observable<PropertyResponse[]> {
    return this.http.get<PropertyResponse[]>(`${this.apiUrl}/category/${category}`);
  }

  getPropertiesByStatus(status: string): Observable<PropertyResponse[]> {
    return this.http.get<PropertyResponse[]>(`${this.apiUrl}/status/${status}`);
  }
}