import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocationResponse } from '../models/location.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = `${environment.apiUrl}/api/v1/location`;

  constructor(private http: HttpClient) { }

  getLocations(): Observable<LocationResponse[]> {
    return this.http.get<LocationResponse[]>(this.apiUrl);
  }

  getLocationById(id: number): Observable<LocationResponse> {
    return this.http.get<LocationResponse>(`${this.apiUrl}/${id}`);
  }

  getLocationsByCityName(cityName: string): Observable<LocationResponse[]> {
    return this.http.get<LocationResponse[]>(`${this.apiUrl}/city/${cityName}`);
  }

  getLocationsByDepartment(department: string): Observable<LocationResponse[]> {
    return this.http.get<LocationResponse[]>(`${this.apiUrl}/department/${department}`);
  }
} 