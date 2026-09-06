import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-[8px] border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7A29] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-[#FFE8D6] bg-[#FFE8D6] text-[#C4500E]',
        primary:
          'border-[#FFE8D6] bg-[#FFE8D6] text-[#FF7A29]',
        secondary:
          'border-[#E4E0DA] bg-[#F7F5F2] text-[#2B4C5C]',
        success:
          'border-[#D1E6DA] bg-[#E7F2EB] text-[#3A7D5C]',
        destructive:
          'border-[#F4D3D1] bg-[#F9E8E7] text-[#B3423A]',
        outline: 'border-[#E4E0DA] text-[#1A1D23] bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
