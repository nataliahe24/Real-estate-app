import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertiesToolbarComponent } from './properties-toolbar.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PropertiesToolbarComponent', () => {
  let component: PropertiesToolbarComponent;
  let fixture: ComponentFixture<PropertiesToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertiesToolbarComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.totalCount).toBe(0);
    expect(component.viewMode).toBe('grid');
  });

  it('should update totalCount when input changes', () => {
    const newCount = 5;
    component.totalCount = newCount;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.total-count').textContent)
      .toContain(`${newCount} propiedades encontradas`);
  });

  it('should update viewMode when input changes', () => {
    component.viewMode = 'list';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const listButton = compiled.querySelector('button:last-child');
    expect(listButton.classList.contains('active')).toBeTruthy();
  });

  it('should emit viewModeChange event when toggleViewMode is called', () => {
    const newMode = 'list';
    jest.spyOn(component.viewModeChange, 'emit');

    component.toggleViewMode(newMode);

    expect(component.viewModeChange.emit).toHaveBeenCalledWith(newMode);
  });

  it('should toggle view mode when grid button is clicked', () => {
    jest.spyOn(component.viewModeChange, 'emit');
    const compiled = fixture.nativeElement;
    const gridButton = compiled.querySelector('button:first-child');

    gridButton.click();
    fixture.detectChanges();

    expect(component.viewModeChange.emit).toHaveBeenCalledWith('grid');
  });

  it('should toggle view mode when list button is clicked', () => {
    jest.spyOn(component.viewModeChange, 'emit');
    const compiled = fixture.nativeElement;
    const listButton = compiled.querySelector('button:last-child');

    listButton.click();
    fixture.detectChanges();

    expect(component.viewModeChange.emit).toHaveBeenCalledWith('list');
  });

  it('should show active class on the correct button based on viewMode', () => {
    component.viewMode = 'grid';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const gridButton = compiled.querySelector('button:first-child');
    const listButton = compiled.querySelector('button:last-child');

    expect(gridButton.classList.contains('active')).toBeTruthy();
    expect(listButton.classList.contains('active')).toBeFalsy();

    component.viewMode = 'list';
    fixture.detectChanges();

    expect(gridButton.classList.contains('active')).toBeFalsy();
    expect(listButton.classList.contains('active')).toBeTruthy();
  });
}); 