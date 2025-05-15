import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryListComponent } from './category-list.component';
import { Category } from '@app/core/models/category.model';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;

  const mockCategories: Category[] = [
    { id: 1, name: 'Category 1', description: 'Description 1' },
    { id: 2, name: 'Category 2', description: 'Description 2' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryListComponent]
    });
    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    component.categories = mockCategories;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate paginated categories correctly', () => {
    component.itemsPerPage = 1;
    expect(component.paginatedCategories.length).toBe(1);
  });

  it('should calculate total pages correctly', () => {
    component.itemsPerPage = 1;
    expect(component.totalPages).toBe(2);
  });

  it('should emit delete event', () => {
    const spy = jest.spyOn(component.deleteCategory, 'emit');
    component.onDelete(1);
    expect(spy).toHaveBeenCalledWith(1);
  });
}); 