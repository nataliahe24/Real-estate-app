import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have current year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });

  it('should have quick links', () => {
    expect(component.quickLinks).toEqual([
      { label: 'Buscar Propiedades', route: '/properties' },
      { label: 'Publica tu propiedad', route: '/publish' },
      { label: 'Property Management', route: '/management' }
    ]);
  });

  it('should have contact info', () => {
    expect(component.contactInfo).toEqual({
      phone: '+800125623525',
      email: 'info@hogar360.com',
      address: 'cll 17 #170 Springfield '
    });
  });

  it('should have social links', () => {
    expect(component.socialLinks).toEqual([
      { iconClass: 'assets/images/facebook.png', url: 'https://facebook.com' },
      { iconClass: 'assets/images/x.png', url: 'https://twitter.com' },
      { iconClass: 'assets/images/instagram.png', url: 'https://instagram.com' },
      { iconClass: 'assets/images/linkedin.png', url: 'https://linkedin.com' }
    ]);
  });

  it('should render social links in template', () => {
    const compiled = fixture.nativeElement;
    const socialLinks = compiled.querySelectorAll('a[href^="https://"]');
    expect(socialLinks.length).toBe(component.socialLinks.length);
  });

  it('should render contact information', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain(component.contactInfo.phone);
    expect(compiled.textContent).toContain(component.contactInfo.email);
    expect(compiled.textContent).toContain(component.contactInfo.address);
  });
}); 