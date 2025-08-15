export interface Property {
  id?: number;
  name: string;
  address: string;
  description: string;
  category: number;
  rooms: number;
  bathrooms: number;
  price: number;
  location: number;
  activePublicationDate: string;
  sellerId: number;
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
  page?: number;
  size?: number;
  location?: string;
  category?: string;
  rooms?: number;
  bathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  orderAsc?: boolean;
  sellerId?: number;
}

export interface PaginatedPropertiesResponse {
  content: PropertyResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sellerId?: number;
}

export interface PropertyFilters {
  page?: number;
  size?: number;
  location?: string;
  category?: string;
  rooms?: number;
  bathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  orderAsc?: boolean;
  sellerId?: number;
}