'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '@/types/product';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

// Simple Input component example that accepts error as string | undefined
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        className={`w-full px-4 py-2 border rounded-lg outline-none transition-all duration-200
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Zod validation schema
const productSchema = z.object({
  proName: z.string().min(1, 'Product name is required'),
  proDes: z.string().min(1, 'Description is required'),
  proPrice: z.number().min(0, 'Price must be greater than or equal to 0'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  imageFile: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file || file.length === 0 || file[0]?.type?.startsWith('image/'),
      'Uploaded file must be an image'
    ),

});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  isLoading,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
        proName: product.proName,
        proDes: product.proDes,
        proPrice: product.proPrice,
        status: product.status, // should be 'ACTIVE' or 'INACTIVE'
      }
      : { status: 'ACTIVE' }


  });

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      const imageFile = data.imageFile?.[0]; // get file from FileList
      const formData = new FormData();

      formData.append('proName', data.proName);
      // formData.append('proDes', data.proDes);
      formData.append('proPrice', String(data.proPrice));
      formData.append('status', data.status);

      if (imageFile) {
        formData.append('image', imageFile); // backend expects 'image'
      }

      // Send formData to backend (example)
      const response = await axios.post('http://localhost:8080/api/v1/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });


      // if (!response.ok) throw new Error('Upload failed');

      toast.success('Product saved successfully!');
      onSubmit(data); // Call onSubmit passed from parent
    } catch (error) {
      toast.error('Failed to save product.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Product Name"
        // error={errors.proName?.message}
        {...register('proName')}
        name="proName" // explicitly add this
      />


      <div className="relative">
        <textarea
          className={`w-full px-4 py-2 border rounded-lg outline-none transition-all duration-200
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.proDes ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Description"
          {...register('proDes')}
          rows={4}
        />
        {errors.proDes?.message && (
          <p className="mt-1 text-sm text-red-500">{errors.proDes.message}</p>
        )}
      </div>

      <Input
        label="Price"
        type="number"
        step="0.01"
        error={errors.proPrice?.message}
        {...register('proPrice', { valueAsNumber: true })}
        name="proPrice"
      />

      {/* File Upload Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          {...register('imageFile')}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {errors.imageFile && typeof errors.imageFile.message === 'string' && (
          <p className="text-sm text-red-500">{errors.imageFile.message}</p>
        )}

      </div>

      {/* Status Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          className={`w-full px-4 py-2 border rounded-lg outline-none transition-all duration-200
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
          {...register('status')}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>

        </select>
        {errors.status?.message && (
          <p className="text-sm text-red-500">{errors.status.message}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>

      <ToastContainer />
    </form>
  );
}
