import { InputHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          className={twMerge(
            'w-full px-4 py-2 border rounded-lg outline-none transition-all duration-200',
            'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            error ? 'border-red-500' : 'border-gray-300',
            'peer placeholder-transparent',
            className
          )}
          placeholder={label}
          {...props}
        />
        <label
          className={twMerge(
            'absolute left-4 -top-2.5 px-1 text-sm transition-all duration-200',
            'peer-placeholder-shown:text-base peer-placeholder-shown:top-2',
            'peer-focus:-top-2.5 peer-focus:text-sm',
            'bg-white',
            error ? 'text-red-500' : 'text-gray-600'
          )}
        >
          {label}
        </label>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 