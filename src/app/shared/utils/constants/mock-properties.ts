import { PropertyResponse, PublicationStatus } from '@app/core/models/property.model';

export const MOCK_CATEGORIES = [
  { id: '1', name: 'House', description: 'Residential house' },
  { id: '2', name: 'Apartment', description: 'Residential apartment' },
  { id: '3', name: 'Commercial', description: 'Commercial property' }
];

export const MOCK_PROPERTIES: PropertyResponse[] = [
  {
    id: 1,
    name: 'Modern House',
    description: 'Beautiful modern house',
    price: 250000, 
    address: '123 Main St',
    category: 'House',
    rooms: 4,
    bathrooms: 2,
    publicationStatus: PublicationStatus.FOR_SALE,
    neighborhood: 'Downtown',
    city: 'New York',
    department: 'Manhattan',
    activePublicationDate: '2024-01-01T00:00:00Z',
    sellerId: 101
  },
  {
    id: 2,
    name: 'Downtown Apartment',
    description: 'Luxury apartment',
    price: 150000,
    address: '456 Downtown Ave',
    category: 'Apartment',
    rooms: 2,
    bathrooms: 1,
    publicationStatus: PublicationStatus.FOR_RENT,
    neighborhood: 'Westside',
    city: 'Los Angeles',
    department: 'California',
    activePublicationDate: '2024-01-10T00:00:00Z',
    sellerId: 102
  }
]; 