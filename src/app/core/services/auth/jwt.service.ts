import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private readonly TOKEN_KEY = 'jwtToken';
  private readonly apiUrl = 'http://localhost:3000/categories';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return window.localStorage.getItem(this.TOKEN_KEY);
  }

  saveToken(token: string): void {
    console.log('Saving token to localStorage');
    window.localStorage.setItem(this.TOKEN_KEY, token);
  }

  destroyToken(): void {
    window.localStorage.removeItem(this.TOKEN_KEY);
  }

  setManualTestToken(token: string): void {
    console.log('Setting manual test token');
    this.saveToken(token);
  }

  createCategory(category: { name: string; description: string }): Observable<any> {
    console.log('Creating category:', category);
    return this.http.post<any>(`${this.apiUrl}`, category, this.httpOptions).pipe(
      tap(data => console.log('Category created:', data)),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error:', error);
    throw error;
  }
} 