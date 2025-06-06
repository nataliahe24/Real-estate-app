import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertySelectComponent } from './property-select.component';
import { PropertyService } from '@app/core/services/properties/property.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MOCK_PAGINATED_PROPERTIES } from '@app/shared/utils/mocks/mock-properties';
import { AUTH_RESPONSE } from '@app/shared/utils/mocks/mock-user';

describe('PropertySelectComponent', () => {
  let component: PropertySelectComponent;
  let fixture: ComponentFixture<PropertySelectComponent>;
  let propertyServiceMock: jest.Mocked<PropertyService>;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(async () => {
    propertyServiceMock = {
      getFilteredProperties: jest.fn().mockReturnValue(of(MOCK_PAGINATED_PROPERTIES))
    } as any;

    authServiceMock = {
      getCurrentUser: jest.fn().mockReturnValue(AUTH_RESPONSE)
    } as any;

    await TestBed.configureTestingModule({
      declarations: [PropertySelectComponent],
      imports: [FormsModule],
      providers: [
        { provide: PropertyService, useValue: propertyServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertySelectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedPropertyId).toBeNull();
    expect(component.properties).toEqual([]);
    expect(component.loading).toBe(true);
    expect(component.error).toBeNull();
    expect(component.currentUserId).toBeNull();
  });

  it('should load properties and filter by current user on init', () => {
    fixture.detectChanges();

    expect(component.currentUserId).toBe(AUTH_RESPONSE.id);
    expect(propertyServiceMock.getFilteredProperties).toHaveBeenCalledWith({
      sellerId: AUTH_RESPONSE.id,
      size: 100,
      sortBy: 'id',
      orderAsc: true
    });
    expect(component.properties).toEqual(MOCK_PAGINATED_PROPERTIES.content);
    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('should handle error when loading properties', () => {
    propertyServiceMock.getFilteredProperties.mockReturnValueOnce(throwError(() => new Error('Test error')));

    fixture.detectChanges();

    expect(component.error).toBe('Error al cargar las propiedades');
    expect(component.loading).toBe(false);
    expect(component.properties).toEqual([]);
  });

  it('should emit selected property id on change', () => {
    const mockEvent = { target: { value: '2' } } as unknown as Event;
    const emitSpy = jest.spyOn(component.propertySelected, 'emit');

    component.onPropertyChange(mockEvent);

    expect(emitSpy).toHaveBeenCalledWith(2);
  });

  it('should handle null current user', () => {
    authServiceMock.getCurrentUser.mockReturnValueOnce(null);

    fixture.detectChanges();

    expect(component.currentUserId).toBeNull();
    expect(propertyServiceMock.getFilteredProperties).toHaveBeenCalledWith({
      sellerId: undefined,
      size: 100,
      sortBy: 'id',
      orderAsc: true
    });
  });

  it('should handle invalid property id in onPropertyChange', () => {
    const mockEvent = { target: { value: 'invalid' } } as unknown as Event;
    const emitSpy = jest.spyOn(component.propertySelected, 'emit');

    component.onPropertyChange(mockEvent);

    expect(emitSpy).toHaveBeenCalledWith(NaN);
  });

  it('should update selectedPropertyId when input changes', () => {
    const newPropertyId = 3;
    component.selectedPropertyId = newPropertyId;
    fixture.detectChanges();

    expect(component.selectedPropertyId).toBe(newPropertyId);
  });
}); 