import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  draggable?: boolean;
}

export function OptimizedImage({ src, alt, className = "", draggable = true }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Blur placeholder */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/30 to-muted/20 animate-pulse transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        decoding="async"
        draggable={draggable}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}