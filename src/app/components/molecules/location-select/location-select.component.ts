import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocationService } from '../../../core/services/locations/location.service';
import { LocationResponse } from '../../../core/models/location.model';

@Component({
  selector: 'app-location-select',
  templateUrl: './location-select.component.html',
  styleUrls: ['./location-select.component.scss']
})
export class LocationSelectComponent implements OnInit {
  @Input() selectedLocationId: number | null = null;
  @Output() locationSelected = new EventEmitter<number>();
  
  locations: LocationResponse[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.isLoading = true;
    this.locationService.findByCityOrDepartment('', 0, 100, true).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.locations = response.content.sort((a, b) => {
            const cityA = a.cityName.toLowerCase();
            const cityB = b.cityName.toLowerCase();
            return cityA.localeCompare(cityB);
          });
        } else {
          this.error = 'El formato de ubicaciones es incorrecto';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar ubicaciones: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  getLocationDisplay(location: LocationResponse): string {
    return `Barrio ${location.neighborhood || 'Sin barrio'}, ${location.cityName}, ${location.department}`;
  }

  onLocationSelected(): void {
    const selectedLocation = this.locations.find(loc => loc.id === this.selectedLocationId);
    if (selectedLocation) {
      this.locationSelected.emit(selectedLocation.id);
    }
  }
} 