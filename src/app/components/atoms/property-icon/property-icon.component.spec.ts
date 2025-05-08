import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyIconComponent } from './property-icon.component';

describe('PropertyIconComponent', () => {
  let component: PropertyIconComponent;
  let fixture: ComponentFixture<PropertyIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyIconComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyIconComponent);
    component = fixture.componentInstance;
    component.icon = 'hotel';
    component.value = 3;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display icon and value', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('hotel');
    expect(compiled.textContent).toContain('3');
  });
}); 