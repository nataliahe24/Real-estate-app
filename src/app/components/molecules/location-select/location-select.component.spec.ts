import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationSelectComponent } from './location-select.component';
import { LocationService } from '@core/services/locations/location.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('LocationSelectComponent', () => {
  let component: LocationSelectComponent;
  let fixture: ComponentFixture<LocationSelectComponent>;
  let locationService: jest.Mocked<LocationService>;

  const mockLocations = {
    content: [
      { 
        id: 1, 
        cityName: 'Madrid', 
        neighborhood: 'Centro',
        department: 'Madrid' 
      },
      { 
        id: 2, 
        cityName: 'Barcelona', 
        neighborhood: 'Gracia',
        department: 'Cataluña' 
      },
      { 
        id: 3, 
        cityName: 'Valencia', 
        neighborhood: 'Ciutat Vella',
        department: 'Valencia' 
      }
    ],
    totalElements: 3
  };

  const mockLocationService = {
    findByCityOrDepartment: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationSelectComponent],
      imports: [CommonModule, FormsModule],
      providers: [
        { provide: LocationService, useValue: mockLocationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationSelectComponent);
    component = fixture.componentInstance;
    locationService = TestBed.inject(LocationService) as jest.Mocked<LocationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.selectedLocationId).toBeNull();
      expect(component.locations).toEqual([]);
      expect(component.isLoading).toBe(true);
      expect(component.error).toBeNull();
    });

    it('should load locations on init', () => {
      mockLocationService.findByCityOrDepartment.mockReturnValue(of(mockLocations));
      fixture.detectChanges();
      expect(locationService.findByCityOrDepartment).toHaveBeenCalledWith('', 0, 100, true);
    });

    it('should handle empty location array', () => {
      mockLocationService.findByCityOrDepartment.mockReturnValue(of({ content: [], totalElements: 0 }));
      fixture.detectChanges();

      expect(component.locations).toEqual([]);
      expect(component.isLoading).toBe(false);
      expect(component.error).toBeNull();
    });

    it('should handle invalid location format', () => {
      mockLocationService.findByCityOrDepartment.mockReturnValue(of(null));
      fixture.detectChanges();

      expect(component.error).toBe('El formato de ubicaciones es incorrecto');
      expect(component.isLoading).toBe(false);
    });

    it('should handle API error', () => {
      const errorMessage = 'Network error';
      mockLocationService.findByCityOrDepartment.mockReturnValue(
        throwError(() => ({ message: errorMessage }))
      );
      fixture.detectChanges();

      expect(component.error).toBe('Error al cargar ubicaciones: ' + errorMessage);
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Location Selection', () => {
    it('should emit selected location id', () => {
      const selectedLocationId = 1;
      component.selectedLocationId = selectedLocationId;
      mockLocationService.findByCityOrDepartment.mockReturnValue(of(mockLocations));
      fixture.detectChanges();
      
      const spy = jest.spyOn(component.locationSelected, 'emit');
      component.onLocationSelected();

      expect(spy).toHaveBeenCalledWith(selectedLocationId);
    });

    it('should handle location selection with null value', () => {
      component.selectedLocationId = null;
      
      const spy = jest.spyOn(component.locationSelected, 'emit');
      component.onLocationSelected();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Location Display', () => {
    it('should format location display correctly', () => {
      const location = {
        id: 1,
        cityName: 'Madrid',
        neighborhood: 'Centro',
        department: 'Madrid'
      };
      
      expect(component.getLocationDisplay(location)).toBe('Madrid, Centro, Madrid');
    });

    it('should handle missing neighborhood', () => {
      const location = {
        id: 1,
        cityName: 'Madrid',
        neighborhood: null,
        department: 'Madrid'
      };
      
      expect(component.getLocationDisplay(location)).toBe('Madrid, Sin barrio, Madrid');
    });
  });
}); 