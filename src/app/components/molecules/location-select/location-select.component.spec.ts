import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationSelectComponent } from './location-select.component';
import { LocationService } from '@app/core/services/locations/location.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../atoms/input/input.component';
import { CommonModule } from '@angular/common';
import { LocationResponse } from '@app/core/models/location.model';
import { MOCK_LOCATIONS } from '@app/shared/utils/constants/mock-locations';

describe('LocationSelectComponent', () => {
  let component: LocationSelectComponent;
  let fixture: ComponentFixture<LocationSelectComponent>;
  let locationService: jest.Mocked<LocationService>;

  const mockLocationService = {
    findByCityOrDepartment: jest.fn()
  };

  beforeEach(async () => {
    jest.useFakeTimers();
    await TestBed.configureTestingModule({
      declarations: [
        LocationSelectComponent,
        InputComponent
      ],
      imports: [
        CommonModule,
        FormsModule
      ],
      providers: [
        { provide: LocationService, useValue: mockLocationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationSelectComponent);
    component = fixture.componentInstance;
    locationService = TestBed.inject(LocationService) as jest.Mocked<LocationService>;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.selectedLocationId).toBeNull();
      expect(component.locations).toEqual([]);
      expect(component.filteredLocations).toEqual([]);
      expect(component.isLoading).toBe(true);
      expect(component.error).toBeNull();
      expect(component.searchText).toBe('');
      expect(component.showDropdown).toBe(false);
    });

    it('should load locations on init', () => {
      mockLocationService.findByCityOrDepartment.mockReturnValue(of({ content: MOCK_LOCATIONS }));
      fixture.detectChanges();

      expect(locationService.findByCityOrDepartment).toHaveBeenCalledWith('', 0, 100, true);
      expect(component.locations).toEqual(MOCK_LOCATIONS);
      expect(component.filteredLocations).toEqual(MOCK_LOCATIONS);
      expect(component.isLoading).toBe(false);
      expect(component.error).toBeNull();
    });

    it('should handle empty location array', () => {
      mockLocationService.findByCityOrDepartment.mockReturnValue(of({ content: [] }));
      fixture.detectChanges();

      expect(component.locations).toEqual([]);
      expect(component.filteredLocations).toEqual([]);
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
    beforeEach(() => {
      mockLocationService.findByCityOrDepartment.mockReturnValue(of({ content: MOCK_LOCATIONS }));
      fixture.detectChanges();
    });

    it('should emit selected location id', () => {
      const location = MOCK_LOCATIONS[0];
      const locationSelectedSpy = jest.spyOn(component.locationSelected, 'emit');
      
      component.selectLocation(location);

      expect(component.selectedLocationId).toBe(location.id);
      expect(component.searchText).toBe(component.getLocationDisplay(location));
      expect(locationSelectedSpy).toHaveBeenCalledWith(location.id);
      expect(component.showDropdown).toBe(false);
    });

    it('should filter locations based on search text', () => {
      component.searchText = 'bogotá';
      component.onSearchChange();

      expect(component.filteredLocations.length).toBe(1);
      expect(component.filteredLocations[0].cityName).toBe('Bogotá');
      expect(component.showDropdown).toBe(true);
    });

    it('should handle empty search text', () => {
      component.searchText = '';
      component.onSearchChange();

      expect(component.filteredLocations).toEqual(MOCK_LOCATIONS);
      expect(component.showDropdown).toBe(true);
    });

    it('should hide dropdown after blur', () => {
      component.showDropdown = true;
      component.onBlur();

      
      jest.advanceTimersByTime(200);
      expect(component.showDropdown).toBe(false);
    });
  });

  describe('Location Display', () => {
    it('should format location display with neighborhood', () => {
      const location = MOCK_LOCATIONS[0];
      const display = component.getLocationDisplay(location);
      expect(display).toBe('Barrio Centro, Bogotá, Cundinamarca');
    });

    it('should format location display with empty neighborhood', () => {
      const location: LocationResponse = {
        id: 1,
        neighborhood: '',
        cityName: 'Bogotá',
        department: 'Cundinamarca'
      };
      const display = component.getLocationDisplay(location);
      expect(display).toBe('Barrio Sin barrio, Bogotá, Cundinamarca');
    });
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      mockLocationService.findByCityOrDepartment.mockReturnValue(of({ content: MOCK_LOCATIONS }));
      fixture.detectChanges();
    });

    it('should render input component', () => {
      const compiled = fixture.nativeElement;
      const input = compiled.querySelector('app-input');
      expect(input).toBeTruthy();
    });

    it('should show loading state', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const loadingElement = compiled.querySelector('.loading');
      expect(loadingElement).toBeTruthy();
      expect(loadingElement.textContent).toContain('Cargando ubicaciones');
    });

    it('should show error message when error occurs', () => {
      component.error = 'Error loading locations';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const errorElement = compiled.querySelector('.error');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('Error loading locations');
    });

    it('should show dropdown with filtered locations', () => {
      component.showDropdown = true;
      component.filteredLocations = MOCK_LOCATIONS;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const dropdown = compiled.querySelector('.autocomplete-dropdown');
      expect(dropdown).toBeTruthy();
      expect(dropdown.children.length).toBe(MOCK_LOCATIONS.length);
    });
  });
}); 