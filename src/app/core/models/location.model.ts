export interface Location {
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