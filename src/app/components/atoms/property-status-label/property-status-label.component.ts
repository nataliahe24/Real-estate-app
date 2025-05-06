import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-property-status-label',
  templateUrl: './property-status-label.component.html',
  styleUrls: ['./property-status-label.component.scss']
})
export class PropertyStatusLabelComponent {
  @Input() status: string = '';
} 