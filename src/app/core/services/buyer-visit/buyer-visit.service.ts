
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BuyerVisit, BuyerVisitResponse, BuyerVisitResponseList } from '../../models/buyer-visit.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth/auth.service';




@Injectable({
    providedIn: 'root'
})
export class BuyerVisitService {
    private apiUrl = environment.apiUrlBuyerVisit;
    
  

constructor(
    private http: HttpClient,
    private authService: AuthService) 
    {
        this.apiUrl = environment.apiUrlBuyerVisit;
    };

    createBuyerVisit(buyerVisit: BuyerVisit): Observable<BuyerVisit> {
        const url = `${this.apiUrl}`;
        return this.http.post<BuyerVisit>(url, buyerVisit);
    }

    getBuyerVisits(): Observable<BuyerVisitResponseList> {
        const url = `${this.apiUrl}`;
        return this.http.get<BuyerVisitResponseList>(url);
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Something went wrong; please try again later.'));
    }
}
