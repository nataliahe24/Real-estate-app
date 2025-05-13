import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LocationModel, LocationResponse } from '../../models/location.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = `${environment.apiUrl}location/`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }

  getLocations(): Observable<LocationModel[]> {
    return this.http.get<LocationModel[]>(this.apiUrl);
  }

  createLocation(location: LocationModel): Observable<LocationModel> {
    console.log('Creating location with data:', location);
    return this.http.post<LocationModel>(this.apiUrl, location, this.httpOptions).pipe(
      tap(data => console.log('Location created:', data)),
      catchError(this.handleError)
    );
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
