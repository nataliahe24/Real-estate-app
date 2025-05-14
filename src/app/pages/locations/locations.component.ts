import { Component, ViewChild } from '@angular/core';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { LocationModel } from '../../core/models/location.model';
import { LocationService } from '@app/core/services/locations/location.service';
import { LocationFormComponent } from '@app/components/organisms/location-form/location-form.component';

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
  @ViewChild(LocationFormComponent) locationFormComponent?: LocationFormComponent;

  constructor(
    private notificationService: NotificationService,
    private locationService: LocationService
  ) {
    console.log('LocationsComponent constructor');
  }

  onLocationCreated(locationData: LocationModel): void {
    const createLocationDto = {
      cityName: locationData.cityName,
      neighborhood: locationData.neighborhood
    };

    this.locationService.createLocation(createLocationDto).subscribe({
      next: () => {
        this.locationFormComponent?.resetForm();
        this.notificationService.success('Ubicación creada exitosamente');
      },
      error: (error) => {
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
    this.locationFormComponent?.resetForm();
  };
} 