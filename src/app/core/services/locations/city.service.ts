import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from '../../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private readonly API_URL = 'assets/data/cities.json';

  constructor(private http: HttpClient) {}

  getCitiesByDepartment(departmentId: number): Observable<City[]> {
    return this.http.get<City[]>(`${this.API_URL}?departmentId=${departmentId}`);
  }
} 