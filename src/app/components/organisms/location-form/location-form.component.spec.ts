import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationFormComponent } from './location-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { LocationService } from '@app/core/services/locations/location.service';
import { MoleculesModule } from '@app/components/molecules/molecules.module';
import { AtomsModule } from '@app/components/atoms/atoms.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('LocationFormComponent', () => {
  let component: LocationFormComponent;
  let fixture: ComponentFixture<LocationFormComponent>;
  let notificationService: jest.Mocked<NotificationService>;
  let locationService: jest.Mocked<LocationService>;

  beforeEach(async () => {
    notificationService = {
      success: jest.fn(),
      error: jest.fn()
    } as any;

    locationService = {
      createLocation: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [LocationFormComponent],
      imports: [
        ReactiveFormsModule,
        MoleculesModule,
        AtomsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: NotificationService, useValue: notificationService },
        { provide: LocationService, useValue: locationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.locationForm.get('city')?.value).toBe('');
    expect(component.locationForm.get('neighborhood')?.value).toBe('');
    expect(component.locationForm.get('department')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.locationForm;
    expect(form.valid).toBeFalsy();
    expect(form.get('city')?.errors?.['required']).toBeTruthy();
    expect(form.get('neighborhood')?.errors?.['required']).toBeTruthy();
    expect(form.get('department')?.errors?.['required']).toBeTruthy();
  });

  it('should validate minimum length', () => {
    const form = component.locationForm;
    form.get('city')?.setValue('ab');
    form.get('neighborhood')?.setValue('ab');
    
    expect(form.get('city')?.errors?.['minlength']).toBeTruthy();
    expect(form.get('neighborhood')?.errors?.['minlength']).toBeTruthy();
  });

  it('should emit submitForm when form is valid', () => {
    const spy = jest.spyOn(component.submitForm, 'emit');
    
    component.locationForm.patchValue({
      city: 'Ciudad Test',
      neighborhood: 'Barrio Test',
      department: '1'
    });

    component.createLocation();

    expect(spy).toHaveBeenCalledWith({
      cityName: 'Ciudad Test',
      neighborhood: 'Barrio Test'
    });
  });

  it('should not emit submitForm when form is invalid', () => {
    const spy = jest.spyOn(component.submitForm, 'emit');
    
    component.createLocation();
    
    expect(spy).not.toHaveBeenCalled();
  });

  it('should reset form and departmentId', () => {
    component.locationForm.patchValue({
      city: 'Ciudad Test',
      neighborhood: 'Barrio Test',
      department: '1'
    });
    component.selectedDepartmentId = 1;

    component.resetForm();

    expect(component.locationForm.get('city')?.value).toBe('');
    expect(component.locationForm.get('neighborhood')?.value).toBe('');
    expect(component.locationForm.get('department')?.value).toBe('');
    expect(component.selectedDepartmentId).toBe(0);
  });

  it('should handle department change', () => {
    component.onDepartmentChange(1);
    expect(component.selectedDepartmentId).toBe(1);
    expect(component.locationForm.get('city')?.value).toBe('');
  });
}); 