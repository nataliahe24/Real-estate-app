import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render button with primary class by default', () => {
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('button'));
    expect(buttonEl.nativeElement.classList).toContain('primary');
  });

  it('should render button with secondary class when type is secondary', () => {
    component.type = 'secondary';
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('button'));
    expect(buttonEl.nativeElement.classList).toContain('secondary');
  });

  it('should display label text', () => {
    component.label = 'Test Button';
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('button'));
    expect(buttonEl.nativeElement.textContent.trim()).toBe('Test Button');
  });

  it('should emit click event when clicked', () => {
    const spy = jest.spyOn(component.onClick, 'emit');
    fixture.detectChanges();
    
    const buttonEl = fixture.debugElement.query(By.css('button'));
    buttonEl.nativeElement.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should be submit type when isSubmit is true', () => {
    component.isSubmit = true;
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('button'));
    expect(buttonEl.nativeElement.type).toBe('submit');
  });
}); 