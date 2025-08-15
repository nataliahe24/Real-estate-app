import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersModalComponent } from './filters-modal.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FiltersModalComponent', () => {
  let component: FiltersModalComponent;
  let fixture: ComponentFixture<FiltersModalComponent>;

  const mockConfig = {
    roomsControl: new FormControl(''),
    bathroomsControl: new FormControl(''),
    minPriceControl: new FormControl(''),
    maxPriceControl: new FormControl(''),
    sortByControl: new FormControl(''),
    sortOptions: [
      { label: 'Precio', value: 'price' },
      { label: 'Habitaciones', value: 'rooms' }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiltersModalComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersModalComponent);
    component = fixture.componentInstance;
    component.config = mockConfig;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClose', () => {
    it('should emit close event', () => {
      
      const closeSpy = jest.spyOn(component.close, 'emit');

     
      component.onClose();

    
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('emitFilters', () => {
    it('should emit filters with numeric values when controls have values', () => {
     
      const filtersChangeSpy = jest.spyOn(component.filtersChange, 'emit');
      component.config.roomsControl.setValue('3');
      component.config.bathroomsControl.setValue('2');
      component.config.minPriceControl.setValue('100000');
      component.config.maxPriceControl.setValue('200000');

      (component as any).emitFilters();

      
      expect(filtersChangeSpy).toHaveBeenCalledWith({
        rooms: 3,
        bathrooms: 2,
        minPrice: 100000,
        maxPrice: 200000
      });
    });

    it('should emit filters with undefined values when controls are empty', () => {
      
      const filtersChangeSpy = jest.spyOn(component.filtersChange, 'emit');
      component.config.roomsControl.setValue('');
      component.config.bathroomsControl.setValue('');
      component.config.minPriceControl.setValue('');
      component.config.maxPriceControl.setValue('');

    
      (component as any).emitFilters();

      expect(filtersChangeSpy).toHaveBeenCalledWith({
        rooms: undefined,
        bathrooms: undefined,
        minPrice: undefined,
        maxPrice: undefined
      });
    });
  });
}); 