import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtService } from './jwt.service';
import { environment } from '../../../../environments/environment';
import { LoginResponse } from '../../models/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private apiUrl = environment.PropertypiUrl;
  private loginUrl = `${environment.userApiUrl}/api/v1/users/login`;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {
    this.populateUser();
  }

  private populateUser(): void {
    const token = this.jwtService.getToken();
    if (token) {
      this.verifyToken().subscribe();
    } else {
      this.purgeAuth();
    }
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials)
      .pipe(
        tap(response => {
          console.log('Login successful, saving token:', response.accessToken);
          this.setAuth(response);
        })
      );
  }

  register(userData: { 
    name: string; 
    email: string; 
    password: string 
  }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/`, userData)
      .pipe(
        tap(response => this.setAuth(response)),
        catchError(error => {
          this.purgeAuth();
          throw error;
        })
      );
  }

  verifyToken(): Observable<LoginResponse | null> {
    const token = this.jwtService.getToken();
    if (!token) {
      this.purgeAuth();
      return of(null);
    }
    
    return this.http.get<LoginResponse>(`${this.apiUrl}`)
      .pipe(
        tap(response => this.setAuth(response)),
        catchError(() => {
          this.purgeAuth();
          return of(null);
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}`, {}).pipe(
      tap(() => this.purgeAuth()),
      catchError(error => {
        this.purgeAuth();
        throw error;
      })
    );
  }

  private setAuth(response: LoginResponse): void {
    this.jwtService.saveToken(response.accessToken);
    this.currentUserSubject.next(response);
  }

  purgeAuth(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getUserRole(): number | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }
} 