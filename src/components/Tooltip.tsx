
import React, { useRef, useEffect, useState } from 'react';

interface TooltipProps {
  children?: React.ReactNode; // Make children optional as it might be a standalone tooltip
  content: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom'; // Make side optional as well
  isVisible: boolean;
  x?: number; // Explicit x coordinate
  y?: number; // Explicit y coordinate
}

export default function Tooltip({ children, content, side = 'right', isVisible, x, y }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      let newStyle: React.CSSProperties = {
        position: 'fixed',
        zIndex: 50,
      };

      if (x !== undefined && y !== undefined) {
        // Explicit positioning
        newStyle.left = x + 10;
        newStyle.top = y;
        newStyle.transform = 'translateY(-50%)';
      } else if (containerRef.current) {
        // Relative positioning (original behavior)
        const containerRect = containerRef.current.getBoundingClientRect();

        newStyle.top = containerRect.top + containerRect.height / 2;
        newStyle.transform = 'translateY(-50%)';

        if (side === 'left') {
          newStyle.right = window.innerWidth - containerRect.left + 10;
        } else {
          newStyle.left = containerRect.right + 10;
        }
      }

      setTooltipStyle(newStyle);
    }
  }, [isVisible, side, x, y, children]); // children is a dependency, so it will re-calculate if children changes

  if (!isVisible) return null;

  return (
    <div
      className={x !== undefined && y !== undefined ? "" : "relative inline-block"} // Only apply relative positioning if children are present and no explicit coords
      ref={containerRef}
    >
      {children}
      <div
        ref={tooltipRef}
        className="p-2 text-sm text-white bg-neutral-800 rounded-lg shadow-lg"
        style={tooltipStyle}
      >
        {content}
      </div>
    </div>
  );
}
