
export interface CafeCategory {
  id: string;
  name: string;
  image?: string;
}

export interface CafeTag {
  id: string;
  name: string;
}

export interface CafePriceRange {
  id: string;
  name: string;
  description: string;
}

export interface Cafe {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  imageSrc: string;
  location: string;
  openHours?: string;
  priceRange: string;
  rating: number;
  categoryIds: string[];
  tagIds: string[];
  website?: string;
  phone?: string;
  address?: string;
}
