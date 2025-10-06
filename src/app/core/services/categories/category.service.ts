import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Category } from '../../models/category.model';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '@app/shared/utils/paginate/pagination';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrlCategories;
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
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
   

  getCategories(page: number = 0, size: number = 10, orderAsc: boolean = true): Observable<PaginatedResponse<Category>> {
    
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
        if (data && data.content) {
          
        } else {
          
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}${id}`, this.httpOptions).pipe(
      catchError(error => this.handleError(error))
    );
  }
  createCategory(category: { name: string; description: string }): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category, this.httpOptions).pipe(
      tap(data => console.log('Category created:', data)),
      catchError(error => this.handleError(error))
    );
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}${category.id}`, category, this.httpOptions).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.status === 0) {
      console.error('Error de conexión');
      
      if (error.message.includes('CORS')) {
        errorMessage = 'Error en el servidor';
      }
    } else {
      switch (error.status) {
        case 400:
          if (error.error?.message?.includes('NAME_MAX_SIZE_EXCEEDED')) {
            errorMessage = 'El nombre excede el tamaño máximo permitido';
          } else if (error.error?.message?.includes('DESCRIPTION_MAX_SIZE_EXCEEDED')) {
            errorMessage = 'La descripción excede el tamaño máximo permitido';
          } else {
            errorMessage = error.error?.message || 'Datos inválidos. Por favor, verifique la información.';
          }
          break;
        case 401:
          errorMessage = error.error?.message || 'No autorizado. Por favor, inicie sesión nuevamente.';
          break;
        case 403:
          errorMessage = error.error?.message || 'No tiene permisos para realizar esta acción.';
          break;
        case 404:
          errorMessage = error.error?.message || 'No se encontró la categoría solicitada';
          break;
        case 409:
          errorMessage = error.error?.message || 'Ya existe una categoría con ese nombre';
          break;
        case 500:
          errorMessage = error.error?.message || 'Error del servidor. Por favor, intente más tarde.';
          break;
        default:
          errorMessage = error.error?.message || `Error ${error.status}: ${error.message}`;
      }
    }

    console.error('Error details:', {
      status: error.status,
      message: errorMessage,
      error: error.error,
      url: error.url
    });

    return throwError(() => new Error(errorMessage));
  }
} 