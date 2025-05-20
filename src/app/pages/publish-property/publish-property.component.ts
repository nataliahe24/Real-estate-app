import { Component, ViewChild } from '@angular/core';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { PropertyService } from '@app/core/services/properties/property.service';
import { PropertyFormComponent } from '@app/components/organisms/property-form/property-form.component';
import { Property } from '@app/core/models/property.model';

@Component({
    selector: 'app-publish-property',
    templateUrl: './publish-property.component.html',
    styleUrls: ['./publish-property.component.scss']
})
export class PublishPropertyComponent {
    @ViewChild(PropertyFormComponent) propertyFormComponent?: PropertyFormComponent;

    constructor(
        private propertyService: PropertyService,
        private notificationService: NotificationService,
    ) {}
    
    onPropertyCreated(propertyData: Property): void {
        this.propertyService.createProperty(propertyData).subscribe({
            next: () => {
                this.propertyFormComponent?.resetForm();
                this.notificationService.success('Propiedad creada exitosamente');
            },
            error: (error) => {
                this.notificationService.error(
                    error.error?.message || 'Error al crear la propiedad'
                );
            }
        });
    }

    handleError(error: any): void {
        const errorMessage = error.error?.message || error.message || 'Error desconocido';
        this.notificationService.error(errorMessage);
    }
}