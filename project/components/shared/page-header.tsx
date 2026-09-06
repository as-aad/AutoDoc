'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
  backHref?: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  showBackButton = false,
  backHref,
  className,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className={cn('flex flex-col gap-3 pb-6 border-b border-[#E2E8F0]', className)}>
      {showBackButton && (
        <div>
          {backHref ? (
            <Button
              variant="link"
              size="sm"
              asChild
              className="text-[#606BDF] hover:underline p-0 h-auto inline-flex items-center gap-1.5 type-small font-semibold"
            >
              <Link href={backHref}>
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Link>
            </Button>
          ) : (
            <Button
              variant="link"
              size="sm"
              onClick={() => router.back()}
              className="text-[#606BDF] hover:underline p-0 h-auto inline-flex items-center gap-1.5 type-small font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="type-h1 font-display text-[#0F172A] text-[28px] sm:text-[32px]">
            {title}
          </h1>
          {description && (
            <p className="mt-1 type-body text-[#64748B]">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
      </div>
    </div>
  );
}
