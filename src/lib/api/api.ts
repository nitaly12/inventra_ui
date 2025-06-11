import axios from 'axios';
import { Product, ProductFormData } from '@/types/product';

const API_BASE_URL = 'http://localhost:8080/api/v1/products'; // adjust if needed

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await axios.get(API_BASE_URL);
  return res.data.payload;
};

export const createProduct = async (data: ProductFormData): Promise<Product> => {
    const res = await axios.post(API_BASE_URL, data);
    return res.data.payload;
};

export const updateProduct = async (id: number, data: ProductFormData): Promise<Product> => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, data);
  return res.data.payload;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
