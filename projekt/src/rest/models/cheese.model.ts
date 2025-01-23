export interface Allergen {
  name: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface Packaging {
  type: string;
  material: string;
  recyclable: boolean;
  weight: number;
}

export interface NutritionalInfo {
  fatContent: string;
  protein: string;
  calories: number;
  sodium: string;
}

export interface Cheese {
  id: string;
  name: string;
  type?: string;
  ageInMonths?: number;
  price?: number;
  milkType?: string;
  nutritionalInfo?: NutritionalInfo;
  origin?: string;
  isArtisanal?: boolean;
  allergens?: Allergen[];
  packaging?: Packaging;
  reviews?: { id: string }[];
  links?: { rel: string; href: string }[];
}
