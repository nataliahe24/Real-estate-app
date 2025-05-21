import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationListComponent } from './location-list.component';
import { LocationService } from '@app/core/services/locations/location.service';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { delay, of, throwError } from 'rxjs';
import { LocationModel } from '@app/core/models/location.model';
import { MOCK_LOCATIONS } from '@app/shared/utils/constants/mock-locations';
import { fakeAsync, tick } from '@angular/core/testing';

describe('LocationListComponent', () => {
  let component: LocationListComponent;
  let fixture: ComponentFixture<LocationListComponent>;
  let locationService: jest.Mocked<LocationService>;
  let notificationService: jest.Mocked<NotificationService>;


  beforeEach(async () => {
    locationService = {
      getLocations: jest.fn().mockReturnValue(of(MOCK_LOCATIONS)),
      findByCityOrDepartment: jest.fn().mockReturnValue(
        of({
          content: MOCK_LOCATIONS,
          page: 0,
          size: 2,
          totalElements: 2,
          totalPages: 1,
        }).pipe(delay(1000)) 
      ),
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
    jest.clearAllMocks(); 
    component.onPageChange(newPage);
    
    expect(component.currentPage).toBe(newPage);
    expect(locationService.findByCityOrDepartment).toHaveBeenLastCalledWith(
      '',
      newPage - 1,
      10,
      true
    );
  });

  it('should calculate total pages correctly', () => {
    component.totalItems = 10;
    component.itemsPerPage = 5;
    expect(component.totalPages).toBe(2);
  });

  describe('Search and Order', () => {
    it('should search locations when search control changes', fakeAsync(() => {
      const searchTerm = 'test';
      jest.clearAllMocks();
      fixture.detectChanges();
      component.searchControl.setValue(searchTerm);
      
      tick(300); 
      tick(1000);
      
      expect(locationService.findByCityOrDepartment).toHaveBeenLastCalledWith(
        searchTerm,
        0,
        10,
        true
      );
    }));

    it('should toggle order and refresh search', () => {
      const initialOrder = component.orderAsc;
      component.toggleOrder();
      
      expect(component.orderAsc).toBe(!initialOrder);
      expect(locationService.findByCityOrDepartment).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle error when loading locations', fakeAsync(() => {
      locationService.findByCityOrDepartment.mockReturnValue(throwError(() => new Error('Test error')));
      jest.clearAllMocks();
      
      component.loadLocations();
      fixture.detectChanges();
      tick(); 
    
      expect(component.loading).toBeFalsy();
    }));

    it('should handle error when searching locations', fakeAsync(() => {
      locationService.findByCityOrDepartment.mockReturnValue(throwError(() => new Error('Test error')));
      fixture.detectChanges();
    
      component.searchControl.setValue('test');
      tick(300); 
  
      expect(component.loading).toBe(false);
    }));
  });

  describe('Pagination', () => {
    it('should update locations when page changes', () => {
      const newPage = 2;
      jest.clearAllMocks();
      component.onPageChange(newPage);
      
      expect(component.currentPage).toBe(newPage);
      expect(locationService.findByCityOrDepartment).toHaveBeenLastCalledWith(
        '',
        newPage - 1,
        10,
        true
      );
    });

    it('should not change page if already on that page', () => {
      const currentPage = component.currentPage;
      jest.clearAllMocks();
      component.onPageChange(currentPage);
      
      expect(locationService.findByCityOrDepartment).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should set loading state when fetching data', fakeAsync(() => {
      component.loadLocations();
    
      expect(component.loading).toBeTruthy(); 
    
      tick(1000); 
      fixture.detectChanges();
    
      expect(component.loading).toBeFalsy(); 
    }));
    
  });
}); 