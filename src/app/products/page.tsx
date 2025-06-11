'use client';

import { useEffect, useState } from 'react';
import { Product, ProductFormData } from '@/types/product';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductForm } from '@/components/products/ProductForm';
import { Button } from '@/components/ui/Button';
import { number } from 'zod/v4';
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '@/lib/api/api';


// Mock data - replace with actual API calls
// const mockProducts: Product[] = [
//   {
//     id: 1,
//     name: 'Product 1',
//     description: 'Description for product 1',
//     price: 99.99,
//     status: 'active',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   // Add more mock products as needed
// ];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await fetchProducts();
        setProducts(products);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);
  
  const filteredProducts = products.filter((product) =>
  (product.name ?? '').toLowerCase().includes((searchQuery ?? '').toLowerCase())
);

  const handleCreate = async (data: ProductFormData) => {
    console.log('Creating product with data:', data);
    setIsLoading(true);
    try {
      const newProduct = await createProduct(data);
      setProducts([...products, newProduct]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsLoading(false);
    }
  };  

  const handleUpdate = async (data: ProductFormData) => {
    if (!selectedProduct) return;
    setIsLoading(true);
    try {
      const updated = await updateProduct(selectedProduct.id, data);
      setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
      setIsFormOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (product: Product) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setIsLoading(true);
    try {
      await deleteProduct(product.id);
      setProducts(products.filter((p) => p.id !== product.id));
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsViewMode(true);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsViewMode(false);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button onClick={() => {
          setSelectedProduct(null);
          setIsViewMode(false);
          setIsFormOpen(true);
        }}>
          Add Product
        </Button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedProduct
                  ? isViewMode
                    ? 'View Product'
                    : 'Edit Product'
                  : 'Add Product'}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setSelectedProduct(null);
                  setIsViewMode(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {isViewMode && selectedProduct ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {selectedProduct.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-lg font-semibold">
                      ${selectedProduct.price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p
                      className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                        selectedProduct.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {selectedProduct.status}
                    </p>
                  </div>
                </div>
                {selectedProduct.imageUrl && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Image</p>
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsViewMode(false);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsFormOpen(false);
                      setSelectedProduct(null);
                      setIsViewMode(false);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <ProductForm
                product={selectedProduct || undefined}
                onSubmit={selectedProduct ? handleUpdate : handleCreate}
                onCancel={() => {
                  setIsFormOpen(false);
                  setSelectedProduct(null);
                }}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
} 