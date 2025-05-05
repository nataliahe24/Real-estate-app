import { Component } from '@angular/core';
import { JwtService } from '../../core/services/auth/jwt.service';
import { CategoryService } from '../../core/services/categories/category.service';

@Component({
  selector: 'app-test',
  template: `
    <div>
      <h2>Test Component</h2>
      <button (click)="setToken()">Set Test Token</button>
      <button (click)="getCategories()">Get Categories</button>
      <div *ngIf="categories">
        <h3>Categories:</h3>
        <pre>{{ categories | json }}</pre>
      </div>
      <div *ngIf="error" class="error">
        {{ error }}
      </div>
    </div>
  `,
  styles: ['.error { color: red; }']
})
export class TestComponent {
  categories: any;
  error: string = '';

  constructor(
    private jwtService: JwtService,
    private categoryService: CategoryService
  ) {}

  setToken(): void {
    this.jwtService.setManualTestToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNaUFwcEpXVCIsInN1YiI6Im5hdGFsaWFoZW5hb3IyNEBnbWFpbC5jb20iLCJhdXRob3JpdGllcyI6IkFETUlOIiwiaWF0IjoxNzQ2MDUwMTcwLCJleHAiOjE3NDYxMzY1NzAsIm5iZiI6MTc0NjA1MDE3MH0.0yoG6FolsPHNmdMFvg7uS6scSHabzFWk1ec-P5zRpWc');
    alert('Token establecido correctamente');
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe(
      data => {
        console.log('Categories received:', data);
        this.categories = data;
        this.error = '';
      },
      err => {
        console.error('Error fetching categories:', err);
        this.error = `Error: ${err.message || JSON.stringify(err)}`;
      }
    );
  }
} 