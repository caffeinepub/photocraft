import { Skeleton } from "@/components/ui/skeleton";

export function PhotoSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-card shadow-card">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function PhotoGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => `skeleton-${i}`).map((id) => (
        <PhotoSkeleton key={id} />
      ))}
    </div>
  );
}
