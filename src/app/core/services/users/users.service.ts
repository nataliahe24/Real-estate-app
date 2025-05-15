import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, CreateUserDto } from '@core/models/user.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly API_URL = `${environment.apiUrl}users/`;
  private readonly SELLER_ROLE_ID = 3;

  constructor(private readonly http: HttpClient) {}

  createUser(userData: CreateUserDto): Observable<User> {
    this.validateUserData(userData);
    
    const userWithRole = {
      ...userData,
      role: this.SELLER_ROLE_ID
    };

    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post<User>(this.API_URL, userWithRole, httpOptions).pipe(
      catchError((error) => {
        console.error('Error in createUser:', error);
        return throwError(() => error);
      })
    );
  }

  private validateUserData(userData: CreateUserDto): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+?[0-9]{10,13}$/;
    const identityDocumentRegex = /^[0-9]+$/;

    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    if (!phoneRegex.test(userData.phoneNumber)) {
      throw new Error('Phone number must be between 10 and 13 digits and may include +');
    }

    if (!identityDocumentRegex.test(userData.identityDocument.toString())) {
      throw new Error('Identity document must contain only numbers');
    }

    const birthDate = new Date(userData.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      throw new Error('User must be at least 18 years old');
    }
  }
} 