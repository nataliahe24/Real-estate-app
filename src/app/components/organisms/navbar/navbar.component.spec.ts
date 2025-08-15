import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NavbarComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    component.menuItems = [
      { label: 'Compra', route: '/properties' },
      { label: 'Renta', route: '/properties' },
      { label: 'Vende', route: '/publish' }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have menu items', () => {
    expect(component.menuItems).toEqual([
      { label: 'Compra', route: '/properties' },
      { label: 'Renta', route: '/properties' },
      { label: 'Vende', route: '/publish' }
    ]);
  });

  it('should have correct menu item labels', () => {
    const compiled = fixture.nativeElement;
    component.menuItems.forEach(item => {
      expect(compiled.textContent).toContain(item.label);
    });
  });

  it('should have correct menu item routes', () => {
    const compiled = fixture.nativeElement;
    const links = compiled.querySelectorAll('a[routerLink]');
    expect(links[0].getAttribute('routerLink')).toBe('/login');
  });
}); 