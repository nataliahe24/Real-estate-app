import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationContainerComponent } from './notification-container.component';
import { NotificationService, Notification } from '@core/services/notifications/notification.service';
import { BehaviorSubject } from 'rxjs';

describe('NotificationContainerComponent', () => {
  let component: NotificationContainerComponent;
  let fixture: ComponentFixture<NotificationContainerComponent>;
  let notificationService: jest.Mocked<NotificationService>;
  let notificationsSubject: BehaviorSubject<Notification[]>;

  const mockNotifications: Notification[] = [
    { id: 1, message: 'Test notification 1', type: 'success' },
    { id: 2, message: 'Test notification 2', type: 'error' }
  ];

  beforeEach(async () => {
    notificationsSubject = new BehaviorSubject<Notification[]>([]);
    
    const mockNotificationService = {
      notifications$: notificationsSubject.asObservable(),
      removeNotification: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [NotificationContainerComponent],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationContainerComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty notifications', () => {
    expect(component.notifications).toEqual([]);
  });

  it('should update notifications when service emits new notifications', () => {
    notificationsSubject.next(mockNotifications);
    fixture.detectChanges();
    expect(component.notifications).toEqual(mockNotifications);
  });

  it('should call removeNotification when closeNotification is called', () => {
    const notificationId = 1;
    component.closeNotification(notificationId);
    expect(notificationService.removeNotification).toHaveBeenCalledWith(notificationId);
  });

  it('should handle empty notifications array', () => {
    notificationsSubject.next([]);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const notificationElements = compiled.querySelectorAll('.notification');
    expect(notificationElements.length).toBe(0);
  });
}); 