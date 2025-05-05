import { Category } from '../../../core/models/category.model';
import { NotificationService } from '../../../core/services/notifications/notification.service';

export const validateCategory = (
  category: Category,
  notificationService: NotificationService
): boolean => {
  if (!category.name.trim()) {
    notificationService.error('El nombre de la categoría es obligatorio.');
    return false;
  }
  if (!category.description.trim()) {
    notificationService.error('La descripción de la categoría no puede estar vacía.');
    return false;
  }
  return true;
};
