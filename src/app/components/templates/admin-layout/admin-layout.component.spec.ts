import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminLayoutComponent } from './admin-layout.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedComponentsModule } from '../../../shared/shared-components.module';
import { AtomsModule } from '../../atoms/atoms.module';
import { OrganismsModule } from '../../organisms/organisms.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '@core/services/auth/auth.service';

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      getCurrentUser: jest.fn().mockReturnValue({ id: 1, name: 'Admin' }),
      isAdmin: jest.fn().mockReturnValue(true),
      isSeller: jest.fn().mockReturnValue(false)
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedComponentsModule,
        AtomsModule,
        OrganismsModule,
        HttpClientTestingModule
      ],
      declarations: [AdminLayoutComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct user data', () => {
    expect(component.user).toBeDefined();
    expect(component.user.name).toBe('Admin');
    expect(component.user.avatar).toBe('/assets/images/usuario.jpeg');
  });

  it('should have correct menu items', () => {
    expect(component.menuItems).toBeDefined();
    expect(component.menuItems.length).toBe(6);
    expect(component.menuItems[0]).toEqual({
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard'
    });
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
    expect(userInfo.textContent).toContain('Bienvenido, Admin');
  });

  it('should have correct user avatar', () => {
    const compiled = fixture.nativeElement;
    const avatar = compiled.querySelector('.user-avatar img');
    expect(avatar.getAttribute('src')).toBe('/assets/images/usuario.jpeg');
    expect(avatar.getAttribute('alt')).toBe('User Avatar');
  });
}); 