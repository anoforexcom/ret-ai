import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage, className = '' }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleInteractionStart = () => setIsDragging(true);
  const handleInteractionEnd = () => setIsDragging(false);

  // Stop dragging if mouse leaves window or is released anywhere
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none group cursor-ew-resize ${className}`}
      onMouseDown={handleInteractionStart}
      onTouchStart={handleInteractionStart}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Background - Full Color/Restored) */}
      <img 
        src={afterImage} 
        alt="Depois" 
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none" 
        draggable={false}
      />
      
      {/* Label After */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded pointer-events-none z-10">
        DEPOIS
      </div>

      {/* Before Image (Foreground - Clipped) */}
      <div 
        className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none border-r-2 border-white shadow-2xl"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={beforeImage} 
          alt="Antes" 
          className="absolute top-0 left-0 max-w-none h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth || '100%' }}
          draggable={false}
        />
        {/* Label Before */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded z-10">
          ANTES
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
          <ChevronsLeftRight className="w-5 h-5 text-indigo-600" />
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;