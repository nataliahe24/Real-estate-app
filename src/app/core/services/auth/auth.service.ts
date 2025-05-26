import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtService } from './jwt.service';
import { environment } from '../../../../environments/environment';
import { LoginResponse } from '../../models/login-response.interface';
import { NotificationService } from '../notifications/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private apiUrl = environment.apiUrl;
  private loginUrl = environment.apiUrlAuth;
 

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private notificationService: NotificationService
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
    const body = {
      email: credentials.email,
      password: credentials.password
    };

    return this.http.post<LoginResponse>(this.loginUrl, body)
      .pipe(
        tap(response => {
          if (response && response.accessToken) {
            this.setAuth(response);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  register(userData: { 
    name: string; 
    email: string; 
    password: string 
  }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl , userData)
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
    
    return this.http.get<LoginResponse>(`${this.loginUrl}`)
      .pipe(
        tap(response => this.setAuth(response)),
        catchError(() => {
          this.purgeAuth();
          return of(null);
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.loginUrl}`, {}).pipe(
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

  hasRole(requiredRole: number): boolean {
    const user = this.getCurrentUser();
    return user?.role === requiredRole;
  }

  isAdmin(): boolean {
    return this.hasRole(2);
  }

  isSeller(): boolean {
    return this.hasRole(3);
  }

  isBuyer(): boolean {
    return this.hasRole(1);
  }

  validateAdminAccess(): boolean {
    if (!this.isAdmin()) {
      this.notificationService.warning('Acceso denegado: Se requieren permisos de administrador');
      return false;
    }
    return true;
  }

  validateSellerAccess(): boolean {
    if (!this.isSeller()) {
      this.notificationService.warning('Acceso denegado: Se requieren permisos de vendedor');
      return false;
    }
    return true;
  }
} 