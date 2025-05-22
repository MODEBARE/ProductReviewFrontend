export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  dateAdded: string;
  averageRating: number;
}

export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}