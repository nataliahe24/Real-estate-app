import { Component, OnInit } from '@angular/core';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/categories/category.service';
import { NotificationService } from '../../../core/services/notifications/notification.service';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.scss']
})
export class CategoryManagerComponent implements OnInit {
  categories: Category[] = [];
  categoryData = { name: '', description: '' };
  
  currentPage = 0; // Las APIs suelen empezar en página 0
  itemsPerPage = 10; // Default size
  totalItems = 0;
  totalPages = 0;
  pageSizeOptions = [5, 10, 20, 50]; // Opciones para el tamaño de página
  
  newCategory: Category = {
    name: '',
    description: ''
  };
  
  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    this.loadCategories();
  }
  
  // Mantener paginatedCategories para compatibilidad con plantilla existente
  get paginatedCategories(): Category[] {
    return this.categories;
  }
  
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page - 1; // Restamos 1 porque la API usa base 0
      this.loadCategories();
    }
  }
  
  onPageSizeChange(size: number): void {
    this.itemsPerPage = size;
    this.currentPage = 0; // Reiniciar a la primera página cuando cambia el tamaño
    this.loadCategories();
  }
  
  loadCategories(): void {
    console.log(`Loading categories: page=${this.currentPage}, size=${this.itemsPerPage}`);
    this.categoryService.getCategories(this.currentPage, this.itemsPerPage, true).subscribe({
      next: (response) => {
        console.log('Categories response:', response);
        
        // Adaptamos según la estructura de respuesta de la API
        if (response && response.content) {
          this.categories = response.content;
          this.totalItems = response.totalElements || 0;
          this.totalPages = response.totalPages || 1;
        } else if (Array.isArray(response)) {
          // Si la respuesta es directamente un array
          this.categories = response;
          this.totalPages = 1;
          this.totalItems = response.length;
        } else {
          console.warn('Unexpected response format:', response);
          this.categories = [];
          this.totalPages = 0;
          this.totalItems = 0;
        }
        
        console.log('Categories loaded:', this.categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  createCategory(): void {
    // Validación de campos vacíos
    if (!this.newCategory.name.trim()) {
      this.notificationService.error('El nombre de la categoría es obligatorio.');
      return;
    }

    if (!this.newCategory.description.trim()) {
      this.notificationService.error('La descripción de la categoría no puede estar vacía');
      return;
    }
   
    this.categoryService.createCategory(this.newCategory).subscribe({
      next: (result) => {
        this.notificationService.success('Categoría creada con éxito');
        this.newCategory = { name: '', description: '' };
        this.loadCategories();
      },
      error: (error) => {
        this.notificationService.error('La categoría ya existe');
      }
    });

  }
}