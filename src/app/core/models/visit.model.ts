export interface Visit {
  sellerId: number;
  propertyId: number;
  startDate: string;
  endDate: string;
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