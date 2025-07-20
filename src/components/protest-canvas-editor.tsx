"use client";

import { useState, useRef, useEffect } from "react";
import { Logo } from "@/components/logo";
import { Toolbar } from "@/components/toolbar";
import { CanvasArea } from "@/components/canvas-area";
import { useToast } from "@/hooks/use-toast";
import type { BaseImage, CanvasElement, TextElement, ImageElement } from "@/lib/types";

const BASE_IMAGE_WIDTH = 800;
const BASE_IMAGE_HEIGHT = 600;

export function ProtestCanvasEditor() {
  const { toast } = useToast();
  const [baseImage, setBaseImage] = useState<BaseImage>({
    src: `https://placehold.co/800x600.png`,
    alt: "Uma imagem de placeholder para o fundo da tela",
    transform: {
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
    },
    originalWidth: BASE_IMAGE_WIDTH,
    originalHeight: BASE_IMAGE_HEIGHT,
  });
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateBaseImage = (updates: Partial<BaseImage["transform"]>) => {
    setBaseImage((prev) => ({
      ...prev,
      transform: { ...prev.transform, ...updates },
    }));
  };

  const addTextElement = () => {
    const newTextElement: TextElement = {
      id: crypto.randomUUID(),
      type: "text",
      text: "Seu Texto Aqui",
      x: 50,
      y: 50,
      color: "#000000",
      fontSize: 48,
      fontFamily: "Inter, sans-serif",
      width: 300,
      rotation: 0,
    };
    setElements((prev) => [...prev, newTextElement]);
    setSelectedElementId(newTextElement.id);
  };

  const addImageElement = (src: string) => {
    const img = new window.Image();
    img.onload = () => {
        const newImageElement: ImageElement = {
            id: crypto.randomUUID(),
            type: "image",
            src,
            x: 100,
            y: 100,
            width: img.width > 200 ? 200 : img.width,
            height: img.width > 200 ? (img.height * 200) / img.width : img.height,
            rotation: 0,
        };
        setElements(prev => [...prev, newImageElement]);
        setSelectedElementId(newImageElement.id);
    };
    img.src = src;
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedElementId(null);
  }

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    toast({ title: "Gerando imagem...", description: "Por favor, aguarde um momento." });

    canvas.width = baseImage.originalWidth;
    canvas.height = baseImage.originalHeight;

    // Draw background
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
    const [h, s, l] = (ctx.fillStyle).split(" ").map(parseFloat);
    ctx.fillStyle = `hsl(${h}, ${s}%, ${l}%)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    const baseImg = new window.Image();
    baseImg.crossOrigin = "anonymous";

    baseImg.onload = async () => {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((baseImage.transform.rotate * Math.PI) / 180);
        ctx.scale(baseImage.transform.scaleX, baseImage.transform.scaleY);
        ctx.drawImage(baseImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();

        for (const el of elements) {
            if (el.type === 'text') {
                ctx.save();
                ctx.font = `${el.fontSize}px ${el.fontFamily}`;
                ctx.fillStyle = el.color;
                ctx.translate(el.x + el.width/2, el.y + el.fontSize/2);
                ctx.rotate(el.rotation * Math.PI / 180);
                ctx.fillText(el.text, -el.width/2, 0);
                ctx.restore();
            } else if (el.type === 'image') {
                const overlayImg = new window.Image();
                overlayImg.crossOrigin = "anonymous";
                await new Promise((resolve, reject) => {
                  overlayImg.onload = resolve;
                  overlayImg.onerror = reject;
                  overlayImg.src = el.src;
                });
                ctx.save();
                ctx.translate(el.x + el.width/2, el.y + el.height/2);
                ctx.rotate(el.rotation * Math.PI / 180);
                ctx.drawImage(overlayImg, -el.width/2, -el.height/2, el.width, el.height);
                ctx.restore();
            }
        }

        const link = document.createElement("a");
        link.download = "tela-de-protesto.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast({ title: "Sucesso!", description: "Sua imagem foi baixada." });
    };
    baseImg.onerror = () => {
        toast({ variant: 'destructive', title: "Erro", description: "Não foi possível carregar a imagem de base para download." });
    };
    baseImg.src = baseImage.src;
  };
  
  const selectedElement = elements.find((el) => el.id === selectedElementId) ?? null;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center px-4 h-14 border-b shrink-0">
        <Logo className="h-6 w-6 text-primary" />
        <h1 className="ml-4 text-xl font-semibold tracking-tight">
          Tela de Protesto
        </h1>
      </header>
      <div className="flex flex-1 min-h-0">
        <Toolbar
          onAddText={addTextElement}
          onAddImage={addImageElement}
          onDownload={handleDownload}
          baseImage={baseImage}
          updateBaseImage={updateBaseImage}
          selectedElement={selectedElement}
          updateElement={updateElement}
          deleteElement={deleteElement}
        />
        <CanvasArea
          baseImage={baseImage}
          elements={elements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={updateElement}
        />
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
}
