import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyerVisitsListComponent } from './buyer-visits-list.component';
import { BuyerVisitService } from '@app/core/services/buyer-visit/buyer-visit.service';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { of, throwError } from 'rxjs';
import { MOCK_BUYER_VISIT_LIST } from '@app/shared/utils/mocks/mock-buyer-visit';

describe('BuyerVisitsListComponent', () => {
  let component: BuyerVisitsListComponent;
  let fixture: ComponentFixture<BuyerVisitsListComponent>;
  let buyerVisitServiceMock: jest.Mocked<BuyerVisitService>;
  let notificationServiceMock: jest.Mocked<NotificationService>;

  beforeEach(async () => {
    buyerVisitServiceMock = {
      getBuyerVisits: jest.fn().mockReturnValue(of(MOCK_BUYER_VISIT_LIST)),
      cancelVisit: jest.fn().mockReturnValue(of({}))
    } as any;

    notificationServiceMock = {
      success: jest.fn(),
      error: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [BuyerVisitsListComponent],
      providers: [
        { provide: BuyerVisitService, useValue: buyerVisitServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BuyerVisitsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.visits).toEqual([]);
    expect(component.loading).toBe(false);
    expect(component.error).toBe(false);
  });

  it('should load visits on init', () => {
    fixture.detectChanges();

    expect(buyerVisitServiceMock.getBuyerVisits).toHaveBeenCalled();
    expect(component.visits).toEqual(MOCK_BUYER_VISIT_LIST);
    expect(component.loading).toBe(false);
    expect(component.error).toBe(false);
  });

  it('should handle error when loading visits', () => {
    buyerVisitServiceMock.getBuyerVisits.mockReturnValueOnce(throwError(() => new Error('Test error')));

    fixture.detectChanges();

    expect(component.error).toBe(true);
    expect(component.loading).toBe(false);
    expect(component.visits).toEqual([]);
    expect(notificationServiceMock.error).toHaveBeenCalledWith('Error al cargar las visitas');
  });

  it('should cancel visit when confirmed', () => {
    const visitId = 1;
    global.confirm = jest.fn().mockReturnValue(true);

    component.cancelVisit(visitId);

    expect(buyerVisitServiceMock.cancelVisit).toHaveBeenCalledWith(visitId);
    expect(notificationServiceMock.success).toHaveBeenCalledWith('Visita cancelada exitosamente');
    expect(buyerVisitServiceMock.getBuyerVisits).toHaveBeenCalledTimes(1); 
  });

  it('should not cancel visit when not confirmed', () => {
    const visitId = 1;
    global.confirm = jest.fn().mockReturnValue(false);

    component.cancelVisit(visitId);

    expect(buyerVisitServiceMock.cancelVisit).not.toHaveBeenCalled();
    expect(notificationServiceMock.success).not.toHaveBeenCalled();
  });

  it('should handle error when canceling visit', () => {
    const visitId = 1;
    global.confirm = jest.fn().mockReturnValue(true);
    buyerVisitServiceMock.cancelVisit.mockReturnValueOnce(throwError(() => new Error('Test error')));

    component.cancelVisit(visitId);

    expect(buyerVisitServiceMock.cancelVisit).toHaveBeenCalledWith(visitId);
    expect(notificationServiceMock.error).toHaveBeenCalledWith('Error al cancelar la visita');
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('pending')).toBe('status-pending');
    expect(component.getStatusClass('confirmed')).toBe('status-confirmed');
    expect(component.getStatusClass('cancelled')).toBe('status-cancelled');
    expect(component.getStatusClass('unknown')).toBe('');
  });

  it('should return correct status text', () => {
    expect(component.getStatusText('pending')).toBe('Pendiente');
    expect(component.getStatusText('confirmed')).toBe('Confirmada');
    expect(component.getStatusText('cancelled')).toBe('Cancelada');
    expect(component.getStatusText('unknown')).toBe('unknown');
  });

  it('should handle case-insensitive status', () => {
    expect(component.getStatusClass('PENDING')).toBe('status-pending');
    expect(component.getStatusText('CONFIRMED')).toBe('Confirmada');
  });

  it('should clean up subscriptions on destroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
}); 