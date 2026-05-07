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
  badge: string | null;
  type: PropertyType;
  is_featured: boolean;
  latitude: number | null;
  longitude: number | null;
  slug: string;
  gallery_images: string[] | null;
  created_at: string;
  description: string | null;
  year_built: number | null;
  parking: number | null;
  amenities: string[] | null;
}

export interface PaginatedProperties {
  data: Property[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
