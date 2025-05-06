import { Component, Input } from '@angular/core';
import { PropertyResponse } from '../../../core/models/property.model';

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.scss']
})
export class PropertyCardComponent {
  @Input() property!: PropertyResponse;
  propertyImages = [
    'assets/images/casa-1.png',
    'assets/images/casa-2.png',
    'assets/images/casa-3.png',
    'assets/images/casa-4.png'
  ];
  
  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
} 