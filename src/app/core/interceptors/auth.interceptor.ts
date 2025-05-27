import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from '../services/jwt/jwt.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.jwtService.getToken();
    
    if (token && token.length > 0) {
      const cleanToken = token.trim();
      console.log('Token length:', cleanToken.length);
    
      request = request.clone({
        headers: request.headers
          .set('Authorization', 'Bearer ' + cleanToken)
          .set('Content-Type', 'application/json')
      });
    } else {
      console.log('No JWT token available for request:', request.url);
    }
    
    return next.handle(request);
  }
} 