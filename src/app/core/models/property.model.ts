export interface Property {
  
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
} 

export interface PaginatedPropertiesResponse {
  content: PropertyResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}