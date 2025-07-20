export type TextElement = {
  id: string;
  type: "text";
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  fontFamily: string;
  width: number;
  rotation: number;
};

export type ImageElement = {
  id: string;
  type: "image";
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export type CanvasElement = TextElement | ImageElement;

export type BaseImage = {
  src: string;
  alt: string;
  transform: {
    rotate: number;
    scaleX: number;
    scaleY: number;
  };
  originalWidth: number;
  originalHeight: number;
};
