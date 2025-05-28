import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitFormComponent } from './visit-form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth/auth.service';
import { AUTH_RESPONSE } from '@app/shared/utils/mocks/mock-user';

describe('VisitFormComponent', () => {
  let component: VisitFormComponent;
  let fixture: ComponentFixture<VisitFormComponent>;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(async () => {
    authServiceMock = {
      getCurrentUser: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [VisitFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VisitFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate start date is not in past', () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    
    component.visitForm.get('startDate')?.setValue(startDate.toISOString());
    expect(component.visitForm.get('startDate')?.errors?.['dateInPast']).toBeTruthy();
  });

  it('should validate start date is not more than 3 weeks in future', () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 22);
    
    component.visitForm.get('startDate')?.setValue(startDate.toISOString());
    expect(component.visitForm.get('startDate')?.errors?.['maxDate']).toBeTruthy();
  });

  it('should validate end date is after start date', () => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() - 1);

    component.visitForm.get('startDate')?.setValue(startDate.toISOString());
    component.visitForm.get('endDate')?.setValue(endDate.toISOString());
    
    expect(component.visitForm.get('endDate')?.errors?.['endDateBeforeStart']).toBeTruthy();
  });

  it('should emit form value on submit when valid', () => {
    const emitSpy = jest.spyOn(component.visitSubmit, 'emit');
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    component.visitForm.patchValue({
      sellerId: AUTH_RESPONSE.id,
      propertyId: 1,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith(expect.objectContaining({
      sellerId: AUTH_RESPONSE.id,
      propertyId: 1,
      startDate: expect.any(String),
      endDate: expect.any(String)
    }));
  });

  it('should not emit when form is invalid', () => {
    const emitSpy = jest.spyOn(component.visitSubmit, 'emit');
    
    component.onSubmit();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should reset form after successful submit', () => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    component.visitForm.patchValue({
      propertyId: 1,
      startDate: '2025-05-28T01:27:02.029Z',
      endDate: '2025-05-28T01:27:02.029Z'
    });

    component.onSubmit();
    component.resetForm();

    expect(component.visitForm.get('propertyId')?.value).toBeNull();
    expect(component.visitForm.get('startDate')?.value).toBe('');
    expect(component.visitForm.get('endDate')?.value).toBe('');

  });

  it('should update propertyId when property is selected', () => {
    const propertyId = 123;
    component.onPropertySelected(propertyId);
    expect(component.visitForm.get('propertyId')?.value).toBe(propertyId);
  });
}); 