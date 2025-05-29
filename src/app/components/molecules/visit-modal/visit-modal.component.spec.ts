import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitModalComponent } from './visit-modal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuyerVisitService } from '@app/core/services/buyer-visit/buyer-visit.service';
import { of, throwError } from 'rxjs';

describe('VisitModalComponent', () => {
  let component: VisitModalComponent;
  let fixture: ComponentFixture<VisitModalComponent>;
  let buyerVisitServiceMock: jest.Mocked<BuyerVisitService>;
  let dialogRefMock: jest.Mocked<MatDialogRef<VisitModalComponent>>;

  const mockData = {
    scheduleId: 1,
    email: 'test@example.com'
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

  it('should initialize form with dialog data', () => {
    expect(component.visitForm.get('scheduleId')?.value).toBe(mockData.scheduleId);
    expect(component.visitForm.get('email')?.value).toBe(mockData.email);
  });

  it('should validate required fields', () => {
    const form = component.visitForm;
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
  });

  it('should create visit on valid form submission', () => {
    const mockResponse = { id: 1 };
    buyerVisitServiceMock.createBuyerVisit.mockReturnValue(of(mockResponse));

    component.onSubmit();

    expect(buyerVisitServiceMock.createBuyerVisit).toHaveBeenCalledWith({
      scheduleId: mockData.scheduleId,
      buyerEmail: mockData.email
    });
    expect(dialogRefMock.close).toHaveBeenCalledWith(mockResponse);
  });

  it('should handle error on form submission', () => {
    const mockError = new Error('Test error');
    buyerVisitServiceMock.createBuyerVisit.mockReturnValue(throwError(() => mockError));

    component.onSubmit();

    expect(dialogRefMock.close).toHaveBeenCalledWith(mockError);
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
}); 