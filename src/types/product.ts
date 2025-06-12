// export interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   status: 'active' | 'inactive';
//   imageUrl?: string;
//   createdAt: string;
//   updatedAt: string;
// }


// export interface Product {
//   proId: number;
//   proName: string;
//   proDes: string;
//   proPrice: number;
//   status: string;
//   imageUrl?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

export interface Product {
  proId: number;
  proName: string;
  proDes: string;
  proPrice: number;
  status: 'ACTIVE' | 'INACTIVE'; 
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
export type ProductFormData = Omit<Product, 'proId' | 'createdAt' | 'updatedAt'>; 