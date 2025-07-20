"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableProps {
  ref: React.RefObject<HTMLElement>;
  initialPosition?: Position;
  onDragEnd?: (pos: Position) => void;
}

export function useDraggable({ ref, initialPosition, onDragEnd }: UseDraggableProps) {
  const [position, setPosition] = useState<Position>(initialPosition || { x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const offsetRef = useRef<Position>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    e.preventDefault();
    isDraggingRef.current = true;
    const rect = ref.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left + position.x,
      y: e.clientY - rect.top + position.y
    };
    
    // The element is absolutely positioned relative to its parent, so we need the parent's offset
    const parentRect = ref.current.parentElement?.getBoundingClientRect();
    if (parentRect) {
        offsetRef.current.x = e.clientX - parentRect.left;
        offsetRef.current.y = e.clientY - parentRect.top;
    }


    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [ref, position.x, position.y]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !ref.current) return;
    
    let newX = e.clientX - offsetRef.current.x;
    let newY = e.clientY - offsetRef.current.y;

    const parentRect = ref.current.parentElement?.getBoundingClientRect();
    if(parentRect) {
        newX = e.clientX - parentRect.left - offsetRef.current.x + position.x;
        newY = e.clientY - parentRect.top - offsetRef.current.y + position.y;
    }

    setPosition({ x: newX, y: newY });
  }, [ref, position.x, position.y]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    if (onDragEnd) {
      onDragEnd(position);
    }
  }, [handleMouseMove, onDragEnd, position]);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('mousedown', handleMouseDown as EventListener);
    }
    return () => {
      if (element) {
        element.removeEventListener('mousedown', handleMouseDown as EventListener);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [ref, handleMouseDown, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (initialPosition) {
        setPosition(initialPosition);
    }
  }, [initialPosition]);

  return { position };
}
