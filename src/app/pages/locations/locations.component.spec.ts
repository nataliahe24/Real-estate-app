import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LocationsComponent } from './locations.component';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { LocationService } from '@app/core/services/locations/location.service';
import { LocationFormComponent } from '@app/components/organisms/location-form/location-form.component';
import { MoleculesModule } from '@app/components/molecules/molecules.module';
import { AtomsModule } from '@app/components/atoms/atoms.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { LocationModel } from '@app/core/models/location.model';

describe('LocationsComponent', () => {
  let component: LocationsComponent;
  let fixture: ComponentFixture<LocationsComponent>;
  let notificationService: jest.Mocked<NotificationService>;
  let locationService: jest.Mocked<LocationService>;
  let mockLocationFormComponent: jest.Mocked<LocationFormComponent>;

  const mockLocation: LocationModel = {
    cityName: 'Test City',
    neighborhood: 'Test Neighborhood'
  };

  beforeEach(async () => {
    notificationService = {
      success: jest.fn(),
      error: jest.fn()
    } as any;

    locationService = {
      createLocation: jest.fn().mockReturnValue(of(mockLocation)),
      findByCityOrDepartment: jest.fn().mockReturnValue(of({ content: [], totalElements: 0 }))
    } as any;

    mockLocationFormComponent = {
      resetForm: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [LocationsComponent, LocationFormComponent],
      imports: [
        MoleculesModule,
        AtomsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: NotificationService, useValue: notificationService },
        { provide: LocationService, useValue: locationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationsComponent);
    component = fixture.componentInstance;
    component.locationFormComponent = mockLocationFormComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle successful location creation', fakeAsync(() => {
    const locationData = { cityName: 'Test City', neighborhood: 'Test Neighborhood' };
    
    component.onLocationCreated(locationData);
    tick();

    expect(locationService.createLocation).toHaveBeenCalledWith(locationData);
    expect(notificationService.success).toHaveBeenCalledWith('Ubicación creada exitosamente');
  }));

  it('should handle location creation error', () => {
    const locationData = { cityName: 'Test City', neighborhood: 'Test Neighborhood' };
    const error = { error: { message: 'Test Error' } };
    locationService.createLocation.mockReturnValue(throwError(() => error));

    component.onLocationCreated(locationData);

    expect(notificationService.error).toHaveBeenCalledWith('Test Error');
  });

  it('should handle error with default message', () => {
    const locationData = { cityName: 'Test City', neighborhood: 'Test Neighborhood' };
    const error = { error: {} };
    locationService.createLocation.mockReturnValue(throwError(() => error));

    component.onLocationCreated(locationData);

    expect(notificationService.error).toHaveBeenCalledWith('Error al crear ubicación');
  });

  it('should handle error message', () => {
    const errorMessage = 'Test Error';
    component.handleError(errorMessage);
    expect(notificationService.error).toHaveBeenCalledWith(errorMessage);
  });
});