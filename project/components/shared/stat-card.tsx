import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: string; positive: boolean };
  accent?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = false,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-[16px] border border-[#EFEDF4] bg-[#FFFFFF] p-6 shadow-sm flex flex-col justify-between transition-all hover:border-[#606BDF]/30',
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="type-caption text-[#6B6F76] font-medium">{label}</span>
        {Icon && (
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-[12px]',
              accent
                ? 'bg-[#FF7A29] text-white'
                : 'bg-[#F5F2FA] text-[#606BDF]'
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <div className="type-h1 font-bold text-[#1B1B1F]">{value}</div>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold',
              trend.positive
                ? 'bg-[#E7F2EB] text-[#3A7D5C]'
                : 'bg-[#F9E8E7] text-[#B3423A]'
            )}
          >
            {trend.positive ? '↑ ' : '↓ '}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
