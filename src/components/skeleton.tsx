export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-surface-container-high ${className}`}
    />
  );
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-6 py-4">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="w-8 h-5" />
          <Skeleton className="w-48 h-5" />
          <Skeleton className="w-24 h-5" />
          <Skeleton className="w-20 h-5 ml-auto" />
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-16 h-5" />
        </div>
      ))}
    </div>
  );
}
