import { TestBed } from '@angular/core/testing';
import { NotificationService, Notification } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add success notification', () => {
    const message = 'Operación exitosa';
    let result: Notification[] = [];
    
    service.notifications$.subscribe(notifications => {
      result = notifications;
    });

    service.success(message);

    expect(result.length).toBe(1);
    expect(result[0].type).toBe('success');
    expect(result[0].message).toBe(message);
  });

  it('should add error notification', () => {
    const message = 'Error en la operación';
    let result: Notification[] = [];
    
    service.notifications$.subscribe(notifications => {
      result = notifications;
    });

    service.error(message);

    expect(result.length).toBe(1);
    expect(result[0].type).toBe('error');
    expect(result[0].message).toBe(message);
  });

  it('should add warning notification', () => {
    const message = 'Advertencia';
    let result: Notification[] = [];
    
    service.notifications$.subscribe(notifications => {
      result = notifications;
    });

    service.warning(message);

    expect(result.length).toBe(1);
    expect(result[0].type).toBe('warning');
    expect(result[0].message).toBe(message);
  });

  it('should add info notification', () => {
    const message = 'Información';
    let result: Notification[] = [];
    
    service.notifications$.subscribe(notifications => {
      result = notifications;
    });

    service.info(message);

    expect(result.length).toBe(1);
    expect(result[0].type).toBe('info');
    expect(result[0].message).toBe(message);
  });

  it('should remove notification by id', () => {
    let result: Notification[] = [];
    
    service.notifications$.subscribe(notifications => {
      result = notifications;
    });

    const id = service.success('Test');
    expect(result.length).toBe(1);

    service.removeNotification(id);
    expect(result.length).toBe(0);
  });

  it('should auto-remove notifications after timeout', () => {
    jest.useFakeTimers();
    
    let result: Notification[] = [];
    service.notifications$.subscribe(notifications => {
      result = notifications;
    });

    service.success('Test', 1000);
    expect(result.length).toBe(1);
    
    jest.advanceTimersByTime(1001);

    expect(result.length).toBe(0);
    
    jest.useRealTimers();
  });

  it('should handle empty message', () => {
    let result: Notification[] = [];
    service.notifications$.subscribe(notifications => {
      result = notifications;
    });

    service.success('');

    expect(result.length).toBe(1);
    expect(result[0].message).toBe('');
  });

  it('should handle null message', () => {
    let result: Notification[] = [];
    service.notifications$.subscribe(notifications => {
      result = notifications;
    });

    service.error(null as any);

    expect(result.length).toBe(1);
    expect(result[0].message).toBe(null);
  });

  it('should handle undefined message', () => {
    let result: Notification[] = [];
    service.notifications$.subscribe(notifications => {
      result = notifications;
    });

    service.warning(undefined as any);

    expect(result.length).toBe(1);
    expect(result[0].message).toBe(undefined);
  });
}); 