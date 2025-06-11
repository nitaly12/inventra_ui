export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: 'active' | 'inactive';
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>; 