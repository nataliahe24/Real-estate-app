import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';
import { By } from '@angular/platform-browser';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    
    component.notification = {
      id: 1,
      type: 'success',
      message: 'Test notification',
      timeout: 5000
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the notification message', () => {
    fixture.detectChanges();
    const messageEl = fixture.debugElement.query(By.css('.notification-message'));
    expect(messageEl.nativeElement.textContent).toBe('Test notification');
  });

  it('should apply correct CSS class based on notification type', () => {
    fixture.detectChanges();
    let notificationEl = fixture.debugElement.query(By.css('.notification'));
    expect(notificationEl.nativeElement.classList).toContain('success');
    
    component.notification.type = 'error';
    fixture.detectChanges();
    expect(notificationEl.nativeElement.classList).toContain('error');
  });

  it('should emit close event when close button is clicked', () => {
    const spy = jest.spyOn(component.close, 'emit');
    fixture.detectChanges();
    
    const closeBtn = fixture.debugElement.query(By.css('.notification-close'));
    closeBtn.nativeElement.click();
    
    expect(spy).toHaveBeenCalledWith(1);
  });
}); 