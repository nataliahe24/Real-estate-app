import { validateCategory } from './validateCategory';
import { Category } from '../../../core/models/category.model';

describe('validateCategory', () => {
  let mockNotificationService: { error: jest.Mock };

  beforeEach(() => {
    mockNotificationService = {
      error: jest.fn()
    };
  });

  it('should return false and notify when name is empty', () => {
    const category: Category = { name: '   ', description: 'Some description' };

    const result = validateCategory(category, mockNotificationService as any);

    expect(result).toBe(false);
    expect(mockNotificationService.error).toHaveBeenCalledWith(
      'El nombre de la categoría es obligatorio.'
    );
  });

  it('should return false and notify when description is empty', () => {
    const category: Category = { name: 'Category Name', description: '   ' };

    const result = validateCategory(category, mockNotificationService as any);

    expect(result).toBe(false);
    expect(mockNotificationService.error).toHaveBeenCalledWith(
      'La descripción de la categoría no puede estar vacía.'
    );
  });

  it('should return true when name and description are valid', () => {
    const category: Category = { name: 'Category Name', description: 'Valid description' };

    const result = validateCategory(category, mockNotificationService as any);

    expect(result).toBe(true);
    expect(mockNotificationService.error).not.toHaveBeenCalled();
  });
});

