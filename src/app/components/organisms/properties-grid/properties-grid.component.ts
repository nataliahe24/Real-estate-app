import { Component, Input } from '@angular/core';
import { PropertyResponse } from '../../../core/models/property.model';

@Component({
  selector: 'app-properties-grid',
  templateUrl: './properties-grid.component.html',
  styleUrls: ['./properties-grid.component.scss']
})
export class PropertiesGridComponent {
  @Input() properties: PropertyResponse[] = [];
  @Input() loading: boolean = false;
  @Input() error: boolean = false;
  @Input() viewMode: 'grid' | 'list' = 'grid';
} 