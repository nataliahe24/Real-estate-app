import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Category } from '../../models/category.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `http://localhost:8090/api/v1/category/`;
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    console.log('CategoryService initialized');
    console.log('API URL:', this.apiUrl);
    this.testApiConnection();
  }

  private testApiConnection(): void {
    fetch(this.apiUrl, { method: 'GET' })
      .then(response => {
        console.log('Fetch API test response status:', response.status);
        return response.text();
      })
      .then(text => {
        console.log('Fetch API test response body (first 100 chars):', text.substring(0, 100));
      })
      .catch(error => {
        console.error('Fetch API test error:', error);
      });
  }
   
    getCategoryNames(orderAsc: boolean = true): Observable<string[]> {
      console.log(`Requesting category names with orderAsc=${orderAsc}`);
      
      const params = new HttpParams().set('orderAsc', orderAsc.toString());
      
      const options = {
        ...this.httpOptions,
        params: params
      };
      console.log('Full request URL for category names:', `${this.apiUrl}list?${params.toString()}`);
    
      return this.http.get<any>(`${this.apiUrl}list`, options).pipe(
        tap(data => {
          console.log('Category names received:', data);
        }),
        catchError(this.handleError)
      );
    }

  getCategories(page: number = 0, size: number = 10, orderAsc: boolean = true): Observable<any> {
    console.log(`Requesting categories: page=${page}, size=${size}, orderAsc=${orderAsc}`);
    
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('orderAsc', orderAsc.toString());
    
    const options = {
      ...this.httpOptions,
      params: params
    };
    
    
    return this.http.get<any>(this.apiUrl, options).pipe(
      tap(data => {
        console.log('Categories received raw data:', data);
        if (data && data.content) {
          
        } else {
          
        }
      }),
      catchError(this.handleError)
    );
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  createCategory(category: { name: string; description: string }): Observable<Category> {
    console.log('Creating category:', category);
    return this.http.post<Category>(this.apiUrl, category, this.httpOptions).pipe(
      tap(data => console.log('Category created:', data)),
      catchError(this.handleError)
    );
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}${category.id}`, category, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Client-side error occurred:', error.error);
      console.log('Is this a CORS issue? Check if your server has CORS enabled.');
      console.log('Network error details:', error);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => new Error(`${error.status}: ${error.message}`));
  }
} 