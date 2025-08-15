export interface Visit {
  id: number;
  sellerId: number;
  propertyId: number;
  propertyName: string;
  city: string;
  neighborhood: string;
  address: string;
  startDate: Date;
  endDate: Date;
} 
export interface VisitResponse {
  content: Visit[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface VisitQueryParams {
  startDate?: string;
  endDate?: string;
  location?: string;
  page?: number;
  size?: number;
} 