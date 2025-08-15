import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellerUserLayoutComponent } from './seller-user-layout.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedComponentsModule } from '../../../shared/shared-components.module';
import { AtomsModule } from '../../atoms/atoms.module';
import { OrganismsModule } from '../../organisms/organisms.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '@core/services/auth/auth.service';

describe('SellerUserLayoutComponent', () => {
  let component: SellerUserLayoutComponent;
  let fixture: ComponentFixture<SellerUserLayoutComponent>;
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      getCurrentUser: jest.fn().mockReturnValue({ id: 1, name: 'Vendedor' }),
      isAdmin: jest.fn().mockReturnValue(false),
      isSeller: jest.fn().mockReturnValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedComponentsModule,
        AtomsModule,
        OrganismsModule,
        HttpClientTestingModule
      ],
      declarations: [SellerUserLayoutComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SellerUserLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct user data', () => {
    expect(component.user).toBeDefined();
    expect(component.user.name).toBe('Vendedor');
    expect(component.user.avatar).toBe('/assets/images/usuario.jpeg');
  });

  it('should have correct menu items', () => {
    expect(component.menuItems).toBeDefined();
    expect(component.menuItems.length).toBe(2);
    expect(component.menuItems[0]).toEqual({
      icon: 'home',
      label: 'Publicaciones',
      route: '/publish'
    });
  });

  it('should have showSidebar input with default value', () => {
    expect(component.showSidebar).toBe(true);
  });

  it('should render all required elements', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.app-container')).toBeTruthy();
    expect(compiled.querySelector('.main-header')).toBeTruthy();
    expect(compiled.querySelector('.content-wrapper')).toBeTruthy();
    expect(compiled.querySelector('.main-content')).toBeTruthy();
  });

  it('should display user name correctly', () => {
    const compiled = fixture.nativeElement;
    const userInfo = compiled.querySelector('.user-info span');
    expect(userInfo.textContent).toContain('Bienvenido, Vendedor');
  });

  it('should have correct user avatar', () => {
    const compiled = fixture.nativeElement;
    const avatar = compiled.querySelector('.user-avatar img');
    expect(avatar.getAttribute('src')).toBe('/assets/images/usuario.jpeg');
    expect(avatar.getAttribute('alt')).toBe('User Avatar');
  });

  it('should update showSidebar when input changes', () => {
    component.showSidebar = false;
    fixture.detectChanges();
    expect(component.showSidebar).toBe(false);
  });
}); 