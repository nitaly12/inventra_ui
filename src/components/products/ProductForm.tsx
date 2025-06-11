'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product, ProductFormData } from '@/types/product';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  status: z.enum(['active', 'inactive']),
  imageUrl: z.string().optional(),
});

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          status: product.status,
          imageUrl: product.imageUrl,
        }
      : {
          status: 'active',
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Product Name"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="relative">
        <textarea
          className={`w-full px-4 py-2 border rounded-lg outline-none transition-all duration-200
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.description ? 'border-red-500' : 'border-gray-300'}
            peer placeholder-transparent`}
          placeholder="Description"
          {...register('description')}
          rows={4}
        />
        <label
          className={`absolute left-4 -top-2.5 px-1 text-sm transition-all duration-200
            peer-placeholder-shown:text-base peer-placeholder-shown:top-2
            peer-focus:-top-2.5 peer-focus:text-sm
            bg-white
            ${errors.description ? 'text-red-500' : 'text-gray-600'}`}
        >
          Description
        </label>
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <Input
        label="Price"
        type="number"
        step="0.01"
        error={errors.price?.message}
        {...register('price', { valueAsNumber: true })}
      />

      <Input
        label="Image URL"
        type="url"
        error={errors.imageUrl?.message}
        {...register('imageUrl')}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          className={`w-full px-4 py-2 border rounded-lg outline-none transition-all duration-200
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
          {...register('status')}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
} 