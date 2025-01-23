export interface Certificate {
  name: string;
  issueDate: string;
  expiryDate: string;
  issuingBody: string;
  certificationNumber: string;
}

export interface Headquarters {
  city: string;
  address: string;
  postalCode: string;
  country: string;
}

export interface Manufacturer {
  id: string;
  name: string;
  country: string;
  foundedYear: number;
  website: string;
  employeeCount: number;
  isOrganic: boolean;
  headquarters: Headquarters;
  certificates: Certificate[];
  producedCheeses: string[];
  links?: { rel: string; href: string }[];
}
