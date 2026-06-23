"use client";

interface SkeletonShimmerProps {
  className?: string;
}

export function SkeletonShimmer({ className = "" }: SkeletonShimmerProps) {
  return (
    <div className={`animate-skeleton-pulse rounded-md bg-[var(--color-surface-2)] ${className}`} aria-hidden="true" />
  );
}

export function CardSkeleton() {
  return (
    <div className="mos-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonShimmer className="h-10 w-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <SkeletonShimmer className="h-4 w-32" />
          <SkeletonShimmer className="h-3 w-48" />
        </div>
      </div>
      <SkeletonShimmer className="h-12 w-full" />
      <div className="flex gap-2">
        <SkeletonShimmer className="h-6 w-16 rounded-full" />
        <SkeletonShimmer className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="mos-card p-6 space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonShimmer className="h-4 w-24" />
        <SkeletonShimmer className="h-9 w-9 rounded-lg" />
      </div>
      <SkeletonShimmer className="h-8 w-16" />
      <SkeletonShimmer className="h-3 w-20" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4 p-4">
        <SkeletonShimmer className="h-4 w-24" />
        <SkeletonShimmer className="h-4 w-32" />
        <SkeletonShimmer className="h-4 w-20" />
        <SkeletonShimmer className="h-4 w-16" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-t border-[var(--color-border)]">
          <SkeletonShimmer className="h-4 w-24" />
          <SkeletonShimmer className="h-4 w-32" />
          <SkeletonShimmer className="h-4 w-20" />
          <SkeletonShimmer className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonShimmer className="h-2 w-2 rounded-full" />
        <div className="space-y-2">
          <SkeletonShimmer className="h-5 w-48" />
          <SkeletonShimmer className="h-4 w-96" />
        </div>
      </div>
      <div className="space-y-3 pl-5">
        <SkeletonShimmer className="h-10 w-full" />
        <SkeletonShimmer className="h-10 w-full" />
        <SkeletonShimmer className="h-24 w-full" />
      </div>
    </div>
  );
}
