import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertiesGridComponent } from './properties-grid.component';
import { PropertyCardComponent } from '../../molecules/property-card/property-card.component';
import { MOCK_PROPERTIES } from '../../../shared/utils/mocks/mock-categories';

describe('PropertiesGridComponent', () => {
  let component: PropertiesGridComponent;
  let fixture: ComponentFixture<PropertiesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertiesGridComponent, PropertyCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesGridComponent);
    component = fixture.componentInstance;
    component.properties = MOCK_PROPERTIES as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render property cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-property-card').length).toBe(MOCK_PROPERTIES.length);
  });
}); 