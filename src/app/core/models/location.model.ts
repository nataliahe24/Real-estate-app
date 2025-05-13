export interface LocationModel {
  cityName: string;
  neighborhood: string;
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