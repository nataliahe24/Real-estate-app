import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyCardComponent } from './property-card.component';
import { PropertyResponse } from '../../../core/models/property.model';

describe('PropertyCardComponent', () => {
  let component: PropertyCardComponent;
  let fixture: ComponentFixture<PropertyCardComponent>;

  const mockProperty: PropertyResponse = {
    id: 1,
    name: 'Casa de prueba',
    city: 'Madrid',
    department: 'Centro',
    price: 100000,
    publicationStatus: 'FOR_SALE',
    rooms: 3,
    bathrooms: 2,
    
  } as PropertyResponse;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyCardComponent);
    component = fixture.componentInstance;
    component.property = mockProperty;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display property name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Casa de prueba');
  });
}); 