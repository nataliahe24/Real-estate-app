import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertySelectComponent } from './property-select.component';
import { PropertyService } from '@app/core/services/properties/property.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MOCK_PROPERTIES } from '@app/shared/utils/mocks/mock-properties';
import { MOCK_USER } from '@app/shared/utils/mocks/mock-user';
import { AUTH_RESPONSE } from '@app/shared/utils/mocks/mock-user';


describe('PropertySelectComponent', () => {
  let component: PropertySelectComponent;
  let fixture: ComponentFixture<PropertySelectComponent>;
  let propertyServiceMock: jest.Mocked<PropertyService>;
  let authServiceMock: jest.Mocked<AuthService>;


  beforeEach(async () => {
    propertyServiceMock = {
      getProperties: jest.fn()
    } as any;

    authServiceMock = {
      getCurrentUser: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [PropertySelectComponent],
      imports: [FormsModule, ReactiveFormsModule],
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
    
    const mockProperties = MOCK_PROPERTIES.map(p => ({ ...p, sellerId: AUTH_RESPONSE.id }));
    authServiceMock.getCurrentUser.mockReturnValue(AUTH_RESPONSE);
    propertyServiceMock.getProperties.mockReturnValue(of(mockProperties));

   
    fixture.detectChanges();

    expect(component.currentUserId).toBe(AUTH_RESPONSE.id);
    expect(propertyServiceMock.getProperties).toHaveBeenCalled();
    expect(component.properties).toEqual(mockProperties);
    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('should handle error when loading properties', () => {
   
    authServiceMock.getCurrentUser.mockReturnValue(AUTH_RESPONSE);
    propertyServiceMock.getProperties.mockReturnValue(throwError(() => new Error('Test error')));

  
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
    
    authServiceMock.getCurrentUser.mockReturnValue(null);
    propertyServiceMock.getProperties.mockReturnValue(of(MOCK_PROPERTIES));

    
    fixture.detectChanges();

    
    expect(component.currentUserId).toBeNull();
    expect(component.properties).toEqual([]);
  });
}); 