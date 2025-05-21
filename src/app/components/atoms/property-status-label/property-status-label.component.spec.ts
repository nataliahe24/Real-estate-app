import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyStatusLabelComponent } from './property-status-label.component';

describe('PropertyStatusLabelComponent', () => {
  let component: PropertyStatusLabelComponent;
  let fixture: ComponentFixture<PropertyStatusLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyStatusLabelComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyStatusLabelComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Status Label', () => {
    it('should display correct label for each status', () => {
      const testCases = [
        { status: 'AVAILABLE', expectedClass: 'AVAILABLE', expectedText: 'AVAILABLE' },
        { status: 'RENTED', expectedClass: 'RENTED', expectedText: 'RENTED' },
        { status: 'SOLD', expectedClass: 'SOLD', expectedText: 'SOLD' }
      ];

      testCases.forEach(({ status, expectedClass, expectedText }) => {
        component.type = status;
        fixture.detectChanges();

        const element = fixture.nativeElement;
        const label = element.querySelector('.status-label');
        
        expect(label.textContent.trim()).toBe(expectedText);
        expect(label.classList.contains(expectedClass)).toBeTruthy();
      });
    });

    it('should handle unknown status gracefully', () => {
      component.type = 'UNKNOWN';
      fixture.detectChanges();

      const element = fixture.nativeElement;
      const label = element.querySelector('.status-label');
      
      expect(label.textContent.trim()).toBe('UNKNOWN');
      expect(label.classList.contains('UNKNOWN')).toBeTruthy();
    });
  });
}); 