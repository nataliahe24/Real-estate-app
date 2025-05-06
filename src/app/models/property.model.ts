export enum PublicationStatus {
  FOR_RENT = 'FOR_RENT',
  FOR_SALE = 'FOR_SALE',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
  INACTIVE = 'INACTIVE'
}

export interface PropertyResponse {
  id: number;
  name: string;
  address: string;
  description: string;
  category: string;
  rooms: number;
  bathrooms: number;
  price: number;
  neighborhood: string;
  city: string;
  department: string;
  activePublicationDate: string;
  publicationStatus: string;
  sellerId: number;
}

export interface PropertyFilter {
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  bathrooms?: number;
  publicationStatus?: PublicationStatus;
} 