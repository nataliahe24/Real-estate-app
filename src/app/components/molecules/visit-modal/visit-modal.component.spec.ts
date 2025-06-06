import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VisitModalComponent } from './visit-modal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuyerVisitService } from '@app/core/services/buyer-visit/buyer-visit.service';
import { of, throwError } from 'rxjs';
import { MOCK_VISIT } from '@app/shared/utils/mocks/mock-visit';

describe('VisitModalComponent', () => {
  let component: VisitModalComponent;
  let fixture: ComponentFixture<VisitModalComponent>;
  let buyerVisitServiceMock: jest.Mocked<BuyerVisitService>;
  let dialogRefMock: jest.Mocked<MatDialogRef<VisitModalComponent>>;

  const mockData = {
    propertyId: 1,
    propertyName: 'Test Property',
    visits: [MOCK_VISIT]
  };

  beforeEach(async () => {
    buyerVisitServiceMock = {
      createBuyerVisit: jest.fn()
    } as any;

    dialogRefMock = {
      close: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [VisitModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: BuyerVisitService, useValue: buyerVisitServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VisitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.visitForm).toBeDefined();
    expect(component.visitForm.get('email')?.value).toBe('');
    expect(component.selectedVisitId).toBeNull();
    expect(component.loading).toBeFalsy();
  });

  it('should select visit', () => {
    component.selectVisit(1);
    expect(component.selectedVisitId).toBe(1);
  });

  it('should handle successful visit creation', () => {
    const mockResponse = { id: 1 };
    buyerVisitServiceMock.createBuyerVisit.mockReturnValue(of(mockResponse));

    component.selectedVisitId = 1;
    component.visitForm.patchValue({
      email: 'test@example.com'
    });

    component.onSubmit();

    expect(buyerVisitServiceMock.createBuyerVisit).toHaveBeenCalledWith({
      scheduleId: 1,
      buyerEmail: 'test@example.com'
    });
    expect(component.loading).toBeFalsy();
    expect(dialogRefMock.close).toHaveBeenCalledWith(mockResponse);
  });

  it('should handle visit creation error', () => {
    buyerVisitServiceMock.createBuyerVisit.mockReturnValue(throwError(() => new Error('Error')));

    component.selectedVisitId = 1;
    component.visitForm.patchValue({
      email: 'test@example.com'
    });

    component.onSubmit();

    expect(buyerVisitServiceMock.createBuyerVisit).toHaveBeenCalled();
    expect(component.loading).toBeFalsy();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    const form = component.visitForm;
    expect(form.valid).toBeFalsy();

    form.get('email')?.setValue('test@example.com');
    expect(form.valid).toBeTruthy();

    form.get('email')?.setValue('');
    expect(form.valid).toBeFalsy();
    expect(form.get('email')?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    const form = component.visitForm;
    
    form.get('email')?.setValue('invalid-email');
    expect(form.valid).toBeFalsy();
    expect(form.get('email')?.errors?.['email']).toBeTruthy();

    form.get('email')?.setValue('valid@email.com');
    expect(form.valid).toBeTruthy();
  });

  it('should close modal', () => {
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should not submit if form is invalid', () => {
    component.selectedVisitId = 1;
    component.visitForm.patchValue({
      email: 'invalid-email'
    });

    component.onSubmit();

    expect(buyerVisitServiceMock.createBuyerVisit).not.toHaveBeenCalled();
  });

  it('should not submit if no visit is selected', () => {
    component.visitForm.patchValue({
      email: 'test@example.com'
    });

    component.onSubmit();

    expect(buyerVisitServiceMock.createBuyerVisit).not.toHaveBeenCalled();
  });

 

  it('should handle multiple visit selections', () => {
    component.selectVisit(1);
    expect(component.selectedVisitId).toBe(1);

    component.selectVisit(2);
    expect(component.selectedVisitId).toBe(2);
  });

  it('should reset loading state on error', () => {
    buyerVisitServiceMock.createBuyerVisit.mockReturnValue(throwError(() => new Error('Error')));

    component.selectedVisitId = 1;
    component.visitForm.patchValue({
      email: 'test@example.com'
    });

    component.onSubmit();
    expect(component.loading).toBeFalsy();
  });

  it('should validate email with special characters', () => {
    const form = component.visitForm;
    
    form.get('email')?.setValue('test.user+label@example.com');
    expect(form.valid).toBeTruthy();

    form.get('email')?.setValue('test.user@subdomain.example.com');
    expect(form.valid).toBeTruthy();
  });

  it('should handle dialog data correctly', () => {
    expect(component.data.propertyId).toBe(mockData.propertyId);
    expect(component.data.propertyName).toBe(mockData.propertyName);
    expect(component.data.visits).toEqual(mockData.visits);
  });
}); 