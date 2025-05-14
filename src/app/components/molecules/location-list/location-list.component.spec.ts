import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationListComponent } from './location-list.component';
import { LocationService } from '@app/core/services/locations/location.service';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { of, throwError } from 'rxjs';
import { LocationModel } from '@app/core/models/location.model';

describe('LocationListComponent', () => {
  let component: LocationListComponent;
  let fixture: ComponentFixture<LocationListComponent>;
  let locationService: jest.Mocked<LocationService>;
  let notificationService: jest.Mocked<NotificationService>;

  const mockLocations: LocationModel[] = [
    { cityName: 'City 1', neighborhood: 'Neighborhood 1' },
    { cityName: 'City 2', neighborhood: 'Neighborhood 2' }
  ];

  beforeEach(async () => {
    locationService = {
      getLocations: jest.fn().mockReturnValue(of(mockLocations)),
      findByCityOrDepartment: jest.fn().mockReturnValue(of({ 
        content: mockLocations, 
        totalElements: 2 
      }))
    } as any;

    notificationService = {
      error: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [LocationListComponent],
      providers: [
        { provide: LocationService, useValue: locationService },
        { provide: NotificationService, useValue: notificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should change page', () => {
    const newPage = 2;
    component.onPageChange(newPage);
    expect(component.currentPage).toBe(newPage);
    expect(locationService.findByCityOrDepartment).toHaveBeenCalled();
  });

  it('should calculate total pages correctly', () => {
    component.totalItems = 10;
    component.itemsPerPage = 5;
    expect(component.totalPages).toBe(2);
  });
}); 