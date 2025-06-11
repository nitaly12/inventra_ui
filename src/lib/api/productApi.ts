import { Product } from '@/types/product';

const BASE_URL = 'https://your-backend.com/api/products';

export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const getProduct = async (id: string): Promise<Product> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};
