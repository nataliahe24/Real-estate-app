import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaginatedPropertiesResponse, PropertyResponse } from '../../../core/models/property.model';
import { PropertyService } from '@app/core/services/properties/property.service';
import { AuthService } from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-property-select',
  templateUrl: './property-select.component.html',
  styleUrls: ['./property-select.component.scss']
})
export class PropertySelectComponent implements OnInit {
  @Input() selectedPropertyId: number | null = null;
  @Output() propertySelected = new EventEmitter<number>();
  
  properties: PropertyResponse[] = [];
  loading = true;
  error: string | null = null;
  currentUserId: number | null = null;

  constructor(private propertyService: PropertyService, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUser()?.id ?? null;
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading = true;
    this.propertyService.getFilteredProperties({
      sellerId: this.currentUserId ?? undefined,
      size: 100,
      sortBy: 'id',
      orderAsc: true
    }).subscribe({
      next: (response: PaginatedPropertiesResponse) => {
        this.properties = response.content;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las propiedades';
        this.loading = false;
        console.error('Error loading properties:', error);
      }
    });
  }

  onPropertyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const propertyId = parseInt(select.value, 10);
    this.propertySelected.emit(propertyId);
  }
} 