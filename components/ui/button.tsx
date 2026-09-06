import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#606BDF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-[#606BDF] text-white hover:bg-[#4B55D4] active:bg-[#3B44B8] shadow-sm shadow-[#606BDF]/20 font-semibold',
        primary:
          'bg-[#606BDF] text-white hover:bg-[#4B55D4] active:bg-[#3B44B8] shadow-sm shadow-[#606BDF]/20 font-semibold',
        accent:
          'bg-[#FF7A29] text-white hover:bg-[#E6671A] active:bg-[#D4590F] shadow-sm shadow-[#FF7A29]/20 font-semibold',
        secondary:
          'border border-[#E2E8F0] text-[#0F172A] bg-white hover:bg-[#F8FAFC] active:bg-[#F1F5F9] font-semibold',
        ghost:
          'text-[#0F172A] bg-transparent hover:bg-[#F1F5F9] active:bg-[#E2E8F0] font-semibold',
        destructive:
          'bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B] font-semibold',
        outline:
          'border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] active:bg-[#F1F5F9] font-semibold',
        link:
          'text-[#606BDF] hover:underline p-0 h-auto font-semibold',
        // Backward compatibility mappings
        hydro:
          'bg-[#606BDF] text-white hover:bg-[#4B55D4] font-semibold',
        'hydro-outline':
          'border border-[#E2E8F0] text-[#0F172A] bg-white hover:bg-[#F8FAFC] font-semibold',
        'hydro-ghost':
          'text-[#0F172A] hover:bg-[#F1F5F9] font-semibold',
        'hydro-destructive':
          'bg-[#DC2626] text-white hover:bg-[#B91C1C] font-semibold',
      },
      size: {
        default: 'h-11 px-6 py-2.5 text-[14px]',
        sm: 'h-9 px-4 py-1.5 text-[13px]',
        lg: 'h-13 px-8 py-3.5 text-[16px]',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
