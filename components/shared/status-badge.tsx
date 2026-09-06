import { cn } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/constants';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_STYLE_MAP: Record<string, string> = {
  pending: 'bg-[#FFE8D6] text-[#C4500E] border-[#FFE8D6]',
  confirmed: 'bg-[#E2EAF0] text-[#2B4C5C] border-[#CBD8E1]',
  in_progress: 'bg-[#FFE8D6] text-[#FF7A29] border-[#FFD8BC]',
  completed: 'bg-[#E7F2EB] text-[#3A7D5C] border-[#D1E6DA]',
  cancelled: 'bg-[#F9E8E7] text-[#B3423A] border-[#F4D3D1]',
  ready: 'bg-[#E2EAF0] text-[#2B4C5C] border-[#CBD8E1]',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status ? status.toLowerCase() : 'pending';
  const styleClass = STATUS_STYLE_MAP[normalizedStatus] || 'bg-[#F7F5F2] text-[#6B6F76] border-[#E4E0DA]';
  const label = STATUS_LABELS[status] || status;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1 text-[12px] leading-tight font-medium',
        styleClass,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
