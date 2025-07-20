"use client";
import React from "react";
import Image from "next/image";
import type { BaseImage, CanvasElement } from "@/lib/types";
import { useDraggable } from "@/hooks/use-draggable";

interface CanvasAreaProps {
  baseImage: BaseImage;
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id:string, updates: Partial<CanvasElement>) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  baseImage,
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current) {
      onSelectElement(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex justify-center items-center p-8 bg-muted/40 overflow-hidden"
      onClick={handleContainerClick}
    >
      <div
        className="relative shadow-2xl"
        style={{
          width: baseImage.originalWidth,
          height: baseImage.originalHeight,
        }}
      >
        <Image
          src={baseImage.src}
          alt={baseImage.alt}
          width={baseImage.originalWidth}
          height={baseImage.originalHeight}
          className="pointer-events-none"
          data-ai-hint="protest crowd"
          style={{
            transform: `rotate(${baseImage.transform.rotate}deg) scaleX(${baseImage.transform.scaleX}) scaleY(${baseImage.transform.scaleY})`,
            transition: 'transform 0.3s ease',
          }}
          priority
        />
        {elements.map((element) => (
          <EditableElement
            key={element.id}
            element={element}
            isSelected={element.id === selectedElementId}
            onSelect={onSelectElement}
            onUpdate={onUpdateElement}
            containerRef={containerRef}
          />
        ))}
      </div>
    </div>
  );
};

interface EditableElementProps {
    element: CanvasElement;
    isSelected: boolean;
    onSelect: (id: string | null) => void;
    onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

const EditableElement: React.FC<EditableElementProps> = ({ element, isSelected, onSelect, onUpdate, containerRef }) => {
    const elementRef = React.useRef<HTMLDivElement>(null);
    const { position } = useDraggable({
        ref: elementRef,
        initialPosition: { x: element.x, y: element.y },
        onDragEnd: (pos) => onUpdate(element.id, { x: pos.x, y: pos.y }),
    });

    return (
        <div
            ref={elementRef}
            className={`absolute cursor-grab active:cursor-grabbing ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: `rotate(${element.rotation}deg)`,
                fontFamily: element.type === 'text' ? element.fontFamily : undefined,
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                onSelect(element.id);
            }}
        >
            {element.type === 'text' && (
                <p
                    className="whitespace-nowrap select-none"
                    style={{
                        fontSize: `${element.fontSize}px`,
                        color: element.color,
                    }}
                >
                    {element.text}
                </p>
            )}
            {element.type === 'image' && (
                <Image
                    src={element.src}
                    alt="Sobrecamada"
                    width={element.width}
                    height={element.height}
                    className="pointer-events-none"
                />
            )}
        </div>
    );
}
