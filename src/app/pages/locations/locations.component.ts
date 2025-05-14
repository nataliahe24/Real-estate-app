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
  ) {
    console.log('LocationsComponent constructor');
  }

  onLocationCreated(locationData: LocationModel): void {
    console.log('onLocationCreated fue llamado con:', locationData);
  
    const createLocationDto = {
      cityName: locationData.cityName,
      neighborhood: locationData.neighborhood
    };

    this.locationService.createLocation(createLocationDto).subscribe({
      next: () => {
        this.notificationService.success('Ubicación creada exitosamente');
      },
      error: (error) => {
        console.error('Error al crear location:', error);
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