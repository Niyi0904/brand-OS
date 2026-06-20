"use client";

interface SkeletonShimmerProps {
  className?: string;
}

export function SkeletonShimmer({ className = "" }: SkeletonShimmerProps) {
  return (
    <div className={`animate-skeleton-pulse rounded-md bg-[var(--color-surface-2)] ${className}`} aria-hidden="true" />
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