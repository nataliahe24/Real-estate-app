import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyResponse, PropertyFilter } from '../models/property.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = `${environment.apiUrl}/api/v1/properties`;

  constructor(private http: HttpClient) { }

  getProperties(filters?: PropertyFilter): Observable<PropertyResponse[]> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof PropertyFilter];
        if (value !== undefined && value !== null && value !== '') {
          params = params.append(key, value.toString());
        }
      });
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