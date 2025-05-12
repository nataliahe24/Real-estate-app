export interface LocationResponse {
  id: number;
  cityName: string;
  neighborhood: string;
  department: string;
}

export interface LocationFilter {
  cityName?: string;
  neighborhood?: string;
  department?: string;
} 