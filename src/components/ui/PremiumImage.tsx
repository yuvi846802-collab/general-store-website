import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface PremiumImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  containerClassName?: string;
}

export function PremiumImage({
  src,
  alt,
  className,
  containerClassName,
  fallbackText,
  ...props
}: PremiumImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  
  // Reset states if src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  // Check if image is already loaded from cache
  useEffect(() => {
    if (imgRef.current?.complete) {
      if (imgRef.current.naturalWidth === 0) {
        setHasError(true);
      }
      setIsLoading(false);
    }
  }, [src]);

  // Handle case where src is empty or undefined
  if (!src) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-md overflow-hidden",
        containerClassName,
        className
      )}>
        {fallbackText ? (
          <span className="text-xl font-bold text-primary/40 uppercase">
            {fallbackText.charAt(0)}
          </span>
        ) : (
          <ImageIcon className="w-8 h-8 text-primary/20" />
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-md bg-muted/20", containerClassName, className)}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-muted flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-muted-foreground/30 animate-pulse" />
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
          {fallbackText ? (
            <span className="text-2xl font-bold text-primary/40 uppercase">
              {fallbackText.charAt(0)}
            </span>
          ) : (
            <ImageIcon className="w-8 h-8 text-primary/20" />
          )}
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt || "Image"}
          className={cn(
            "object-cover w-full h-full transition-opacity duration-500",
            isLoading ? "opacity-0" : "opacity-100",
            // Add a subtle scale effect on load for a premium feel
            !isLoading && "animate-in zoom-in-95 duration-700"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
}
