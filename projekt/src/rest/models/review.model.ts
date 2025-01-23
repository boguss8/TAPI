export interface Reviewer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  purchaseHistory: number;
}

export interface DetailedRatings {
  flavor: number;
  texture: number;
  value: number;
  packaging: number;
  overall: number;
}

export interface Review {
  id: string;
  cheeseId: string;
  reviewer: Reviewer;
  ratings: DetailedRatings;
  comment: string;
  verifiedPurchase: boolean;
  datePosted: string;
  helpfulVotes: number;
  wouldRecommend: boolean;
  links?: { rel: string; href: string }[];
}
