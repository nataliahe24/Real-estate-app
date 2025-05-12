import { Component } from '@angular/core';
import { NotificationService } from '@app/core/services/notifications/notification.service';


@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent {
  constructor(private notificationService: NotificationService) {}

  onLocationCreated(location: Location): void {
    this.notificationService.success('Ubicación creada exitosamente');
  }

  onError(error: string): void {
    this.notificationService.error(error);
  }
} 