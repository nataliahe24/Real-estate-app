import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertiesLayoutComponent } from './properties-layout.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedComponentsModule } from '../../../shared/shared-components.module';
import { AtomsModule } from '../../atoms/atoms.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '@core/services/auth/auth.service';

describe('PropertiesLayoutComponent', () => {
  let component: PropertiesLayoutComponent;
  let fixture: ComponentFixture<PropertiesLayoutComponent>;
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      getCurrentUser: jest.fn().mockReturnValue({ id: 1, name: 'User' }),
      isAdmin: jest.fn().mockReturnValue(false),
      isSeller: jest.fn().mockReturnValue(false)
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedComponentsModule,
        AtomsModule,
        HttpClientTestingModule
      ],
      declarations: [PropertiesLayoutComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct menu items', () => {
    expect(component.menuItems).toBeDefined();
    expect(component.menuItems.length).toBe(3);
    expect(component.menuItems[0]).toEqual({
      label: 'Compra',
      route: ''
    });
  });

  it('should render all required elements', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.properties-layout')).toBeTruthy();
    expect(compiled.querySelector('header')).toBeTruthy();
    expect(compiled.querySelector('main')).toBeTruthy();
  });
}); 