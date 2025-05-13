export interface LocationModel {
  id: number;
  cityName: string;
  neighborhood: string;
  department: string;
  address: string;
}

export interface LocationFilter {
  cityName?: string;
  neighborhood?: string;
  department?: string;
}

export interface LocationResponse {
  id: number;
  cityName: string;
  neighborhood: string;
  department: string;
} 