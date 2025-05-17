export type Point = {
  x: number;
  y: number;
};

export type ElementType = 
  | 'rectangle'
  | 'ellipse'
  | 'line'
  | 'arrow'
  | 'text'
  | 'freedraw';

export type Element = {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  opacity: number;
  roughness: number;
  points?: Point[];
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: string;
  angle: number;
};

export type Tool = {
  type: ElementType | 'selection' | 'hand';
  icon: string;
  name: string;
};

export type ToolType = Tool['type'];