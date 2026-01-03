import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  draggable?: boolean;
}

export function OptimizedImage({ src, alt, className = "", draggable = false }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div 
      className="relative w-full h-full select-none"
      onContextMenu={handleContextMenu}
    >
      {/* Static placeholder */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted/60 transition-opacity duration-500 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
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
        draggable={false}
        onLoad={() => setIsLoaded(true)}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        style={{ 
          WebkitUserSelect: 'none',
          userSelect: 'none',
          pointerEvents: 'none'
        }}
      />
      {/* Invisible overlay to block interaction */}
      <div 
        className="absolute inset-0 bg-transparent z-10"
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
      />
    </div>
  );
}
