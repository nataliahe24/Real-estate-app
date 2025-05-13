import { Component } from '@angular/core';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { LocationModel } from '../../core/models/location.model';
import { LocationService } from '@app/core/services/locations/location.service';

interface LocationFormData {
  cityName: string;
  neighborhood: string;
}

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent {
  constructor(
    private notificationService: NotificationService,
    private locationService: LocationService
  ) {}

  onLocationCreated(locationData: LocationFormData): void {
    console.log('Location creation started with data:', locationData);

    if (!locationData.cityName || !locationData.neighborhood) {
      this.notificationService.error('La ciudad y el barrio son requeridos');
      return;
    }

    const location: LocationModel = {
      cityName: locationData.cityName,
      neighborhood: locationData.neighborhood,
    };

    this.locationService.createLocation(location).subscribe({
      next: (response) => {
        console.log('Location created successfully:', response);
        this.notificationService.success('Ubicación creada exitosamente');
      },
      error: (error) => {
        console.error('Error creating location:', error);
        this.notificationService.error(
          error.error?.message || 'Error al crear ubicación'
        );
      }
    });
  }

  handleError(error: string): void {
    this.notificationService.error(error);
  }

  handleCancel(): void {
    this.notificationService.info('Operación cancelada');
  }
} 