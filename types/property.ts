// Database types derived from the Supabase schema
export type PropertyType = "sale" | "rent";

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  price_suffix: string | null;
  beds: number;
  baths: number;
  area: number;
  image_url: string;
  badge: string | null;
  type: PropertyType;
  is_featured: boolean;
  created_at: string;
}

export interface PaginatedProperties {
  data: Property[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
