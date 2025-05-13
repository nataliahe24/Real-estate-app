import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocationModel, LocationResponse } from '../../models/location.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = `${environment.apiUrl}location/`;

  constructor(private http: HttpClient) {}

  getLocations(): Observable<LocationModel[]> {
    return this.http.get<LocationModel[]>(this.apiUrl);
  }

  createLocation(location: CreateLocationDto): Observable<LocationModel> {
    return this.http.post<LocationModel>(this.apiUrl, location);
  }

  updateLocation(id: number, location: LocationModel): Observable<LocationModel> {
    return this.http.put<LocationModel>(`${this.apiUrl}/${id}`, location);
  }
  findByCityOrDepartment(
    searchText: string,
    page: number,
    size: number,
    orderAsc: boolean
  ): Observable<{ content: LocationResponse[]; totalElements: number }> {
    const params = new HttpParams()
      .set('searchText', searchText)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('orderAsc', orderAsc.toString());

    return this.http.get<{ content: LocationResponse[]; totalElements: number }>(
      `${this.apiUrl}`,
      { params }
    );
  }
}

export interface CreateLocationDto {
  cityName: string;
  neighborhood: string;
} 