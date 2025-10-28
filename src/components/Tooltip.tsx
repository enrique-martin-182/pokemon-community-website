
import React, { useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side: 'left' | 'right';
  isVisible: boolean;
}

export default function Tooltip({ children, content, side, isVisible }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (isVisible && tooltipRef.current && containerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      let newStyle: React.CSSProperties = {
        position: 'fixed',
        top: containerRect.top + containerRect.height / 2,
        transform: 'translateY(-50%)',
        zIndex: 50,
      };

      if (side === 'left') {
        newStyle.right = window.innerWidth - containerRect.left + 10; // 10px gap
      } else {
        newStyle.left = containerRect.right + 10; // 10px gap
      }

      setTooltipStyle(newStyle);
    }
  }, [isVisible, children, side]);

  if (!isVisible) return null;

  return (
    <div
      className="relative inline-block"
      ref={containerRef}
    >
      {children}
      <div
        ref={tooltipRef}
        className="w-64 p-2 text-sm text-white bg-neutral-800 rounded-lg shadow-lg"
        style={tooltipStyle}
      >
        {content}
      </div>
    </div>
  );
}
