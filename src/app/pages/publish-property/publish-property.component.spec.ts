import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublishPropertyComponent } from './publish-property.component';
import { PropertyService } from '@app/core/services/properties/property.service';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { PropertyFormComponent } from '@app/components/organisms/property-form/property-form.component';
import { Property } from '@app/core/models/property.model';
import { of, throwError } from 'rxjs';
import { MOCK_PROPERTY_PUBLISHED } from '@app/shared/utils/mocks/mock-properties';

describe('PublishPropertyComponent', () => {
  let component: PublishPropertyComponent;
  let fixture: ComponentFixture<PublishPropertyComponent>;
  let propertyServiceMock: jest.Mocked<PropertyService>;
  let notificationServiceMock: jest.Mocked<NotificationService>;
  let propertyFormComponentMock: jest.Mocked<PropertyFormComponent>;



  beforeEach(async () => {
    propertyServiceMock = {
      createProperty: jest.fn().mockReturnValue(of(MOCK_PROPERTY_PUBLISHED)),
    } as any;

    notificationServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
    } as any;

    propertyFormComponentMock = {
      resetForm: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [PublishPropertyComponent],
      providers: [
        { provide: PropertyService, useValue: propertyServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PublishPropertyComponent);
    component = fixture.componentInstance;
    component.propertyFormComponent = propertyFormComponentMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onPropertyCreated', () => {
    it('should create property successfully', () => {
      propertyServiceMock.createProperty.mockReturnValue(of(MOCK_PROPERTY_PUBLISHED));

      component.onPropertyCreated(MOCK_PROPERTY_PUBLISHED);

      expect(propertyServiceMock.createProperty).toHaveBeenCalledWith(MOCK_PROPERTY_PUBLISHED);

      expect(notificationServiceMock.success).toHaveBeenCalledWith(
        'Propiedad creada exitosamente'
      );
    });

    it('should handle error when creating property', () => {
      const error = { error: { message: 'Test error' } };
      propertyServiceMock.createProperty.mockReturnValue(throwError(() => error));

      component.onPropertyCreated(MOCK_PROPERTY_PUBLISHED);

      expect(propertyServiceMock.createProperty).toHaveBeenCalledWith(MOCK_PROPERTY_PUBLISHED);
      expect(notificationServiceMock.error).toHaveBeenCalledWith('Test error');
    });

    it('should handle error with default message when no error message provided', () => {
      const error = {};
      propertyServiceMock.createProperty.mockReturnValue(throwError(() => error));

      component.onPropertyCreated(MOCK_PROPERTY_PUBLISHED);

      expect(notificationServiceMock.error).toHaveBeenCalledWith(
        'Error al crear la propiedad'
      );
    });
  });

  describe('handleError', () => {
    it('should handle error with error message from error object', () => {
      const error = { error: { message: 'Test error' } };
      component.handleError(error);
      expect(notificationServiceMock.error).toHaveBeenCalledWith('Test error');
    });

    it('should handle error with message property', () => {
      const error = { message: 'Test error' };
      component.handleError(error);
      expect(notificationServiceMock.error).toHaveBeenCalledWith('Test error');
    });

    it('should handle error with default message when no error details', () => {
      const error = {};
      component.handleError(error);
      expect(notificationServiceMock.error).toHaveBeenCalledWith('Error desconocido');
    });
  });
}); 