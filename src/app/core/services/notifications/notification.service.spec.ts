import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a success notification', () => {
    let result: any;
    service.notifications$.subscribe(notifications => {
      result = notifications;
    });

    service.success('Test success');
    
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('success');
    expect(result[0].message).toBe('Test success');
  });

  it('should add an error notification', () => {
    let result: any;
    service.notifications$.subscribe(notifications => {
      result = notifications;
    });

    service.error('Test error');
    
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('error');
    expect(result[0].message).toBe('Test error');
  });

  it('should remove a notification by id', () => {
    let result: any;
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
    
    let result: any;
    service.notifications$.subscribe(notifications => {
      result = notifications;
    });

    service.success('Test', 1000);
    expect(result.length).toBe(1);
    
    jest.advanceTimersByTime(1001);
    
    expect(result.length).toBe(0);
    
    jest.useRealTimers();
  });
}); 