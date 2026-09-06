import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({
  rating,
  size = 'md',
  showValue = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const sizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <Star
              key={star}
              className={cn(
                sizes[size],
                filled || half
                  ? 'text-accent fill-accent'
                  : 'text-border fill-border'
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className={cn('font-bold text-foreground', textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn('text-muted-foreground', textSizes[size])}>
          {reviewCount} reviews
        </span>
      )}
    </div>
  );
}
