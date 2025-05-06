import { Component, Input } from '@angular/core';
import { PropertyResponse } from '../../../models/property.model';

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.scss']
})
export class PropertyCardComponent {
  @Input() property!: PropertyResponse;
  
  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
} 