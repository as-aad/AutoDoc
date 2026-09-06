import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[#E4E0DA] bg-[#FFFFFF] p-8 text-center',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#FFE8D6] text-[#FF7A29]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-3 type-h3 font-bold text-[#1A1D23]">{title}</h3>
      {description && (
        <p className="mt-1 type-body text-[#6B6F76] max-w-md">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
