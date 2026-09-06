import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-[8px] border border-[#E4E0DA] bg-[#FFFFFF] px-3 py-2 text-[14px] text-[#1A1D23] transition-colors placeholder:text-[#6B6F76] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A29] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F5F2] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
