import React, { useState, useRef, useEffect, useCallback } from 'react';

interface FloatingWindowProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
}

const FloatingWindow: React.FC<FloatingWindowProps> = ({ isOpen = true, onClose, title, children }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log(e)
    setDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: Math.max(0, Math.min(window.innerWidth - 400, newX)), y: Math.max(0, Math.min(window.innerHeight - 300, newY)) });
    }
  }, [dragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  return (
    <div
      ref={windowRef}
      className="bg-white rounded-lg shadow-lg w-96 h-64 overflow-hidden"
      style={{ position: 'absolute', left: position.x, top: position.y }}
    >
      <div className="bg-gray-200 p-2 cursor-move" onMouseDown={handleMouseDown}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
      </div>
      <div className="p-4 h-full overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default FloatingWindow;
