import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { VisitSchedule } from '../../models/visit.model';

@Injectable({
  providedIn: 'root'
})
export class VisitScheduleService {
  private readonly apiUrl = environment.apiUrlVisits;

  constructor(private readonly http: HttpClient) {}

  createVisitSchedule(
    visitSchedule: VisitSchedule
  ): Observable<VisitSchedule> {
    return this.http.post<VisitSchedule>(this.apiUrl, visitSchedule);
  }
} 