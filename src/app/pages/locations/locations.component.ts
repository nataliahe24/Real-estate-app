import { Component } from '@angular/core';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { LocationModel } from '../../core/models/location.model';
import { LocationService, CreateLocationDto } from '@app/core/services/locations/location.service';

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

  onLocationCreated(location: CreateLocationDto): void {
    this.locationService.createLocation(location).subscribe({
      next: () => {
        this.notificationService.success('Ubicación creada exitosamente');
      },
      error: () => {
        this.notificationService.error('Error al crear ubicación');
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