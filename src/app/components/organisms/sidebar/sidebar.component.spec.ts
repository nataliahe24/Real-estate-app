import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  const mockMenuItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Properties', route: '/properties', icon: 'home' },
    { label: 'Users', route: '/users', icon: 'people' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    component.menuItems = mockMenuItems;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have menu items', () => {
    expect(component.menuItems).toEqual(mockMenuItems);
  });

  it('should render menu items in template', () => {
    const compiled = fixture.nativeElement;
    const menuItems = compiled.querySelectorAll('li');
    expect(menuItems.length).toBe(mockMenuItems.length);
  });

  it('should render correct menu item labels', () => {
    const compiled = fixture.nativeElement;
    mockMenuItems.forEach(item => {
      expect(compiled.textContent).toContain(item.label);
    });
  });

  it('should render correct menu item icons', () => {
    const compiled = fixture.nativeElement;
    const icons = compiled.querySelectorAll('.material-icons');
    mockMenuItems.forEach((item, index) => {
      expect(icons[index].textContent).toBe(item.icon);
    });
  });

  it('should apply active class when route is active', () => {
    const compiled = fixture.nativeElement;
    const menuItems = compiled.querySelectorAll('li');
    expect(menuItems[0].classList.contains('active')).toBeFalsy();
  });
}); 