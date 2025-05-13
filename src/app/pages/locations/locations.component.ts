import { Component } from '@angular/core';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { LocationModel } from '../../core/models/location.model';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent {
  constructor(private notificationService: NotificationService) {}

  onLocationCreated(location: LocationModel): void {
    this.notificationService.success('Ubicación creada exitosamente');
  }

  handleError(error: string): void {
    this.notificationService.error(error);
  }

  handleCancel(): void {
    this.notificationService.info('Operación cancelada');
  }
} 