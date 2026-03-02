import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useStorage } from "../hooks/useStorage";

interface PhotoImageProps {
  blobId: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

const urlCache = new Map<string, string>();

export function PhotoImage({
  blobId,
  alt,
  className,
  onLoad,
}: PhotoImageProps) {
  const [url, setUrl] = useState<string | null>(urlCache.get(blobId) ?? null);
  const [isLoading, setIsLoading] = useState(!urlCache.has(blobId));
  const [hasError, setHasError] = useState(false);
  const { getFileUrl } = useStorage();

  useEffect(() => {
    if (urlCache.has(blobId)) {
      setUrl(urlCache.get(blobId)!);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setHasError(false);

    getFileUrl(blobId)
      .then((resolvedUrl) => {
        if (!cancelled) {
          urlCache.set(blobId, resolvedUrl);
          setUrl(resolvedUrl);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHasError(true);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [blobId, getFileUrl]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "animate-pulse bg-gradient-to-br from-secondary to-accent",
          className,
        )}
      />
    );
  }

  if (hasError || !url) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground text-xs",
          className,
        )}
      >
        <span>Unable to load</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={cn("object-cover", className)}
      onLoad={onLoad}
      onError={() => setHasError(true)}
    />
  );
}
