import React, { useEffect, useRef, useState } from 'react';
import { useElements } from '../context/ElementContext';
import { useTool } from '../context/ToolContext';
import { renderElement } from '../utils/renderElements';
import { generateId } from '../utils/helpers';
import { Element, Point } from '../types';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { elements, setElements, selectedElement, setSelectedElement } = useElements();
  const { tool } = useTool();

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [textPosition, setTextPosition] = useState<Point | null>(null);

  // Resize and initial draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !wrapperRef.current) return;

    const resizeCanvas = () => {
      canvas.width = wrapperRef.current!.clientWidth;
      canvas.height = wrapperRef.current!.clientHeight;
      redrawCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [elements, offset, scale]);

  // Redraw on elements, offset, scale change
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    elements.forEach(el => renderElement(ctx, el));
    ctx.restore();
  };

  // Handle mouse down (start drawing or pan or select or text)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    // Convert mouse to canvas coords with pan and zoom
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    setStartPoint({ x, y });

    if (tool === 'selection') {
      const clickedElement = findElementAtPosition(x, y);
      setSelectedElement(clickedElement);
      setIsDrawing(false);
    } else if (tool === 'hand') {
      // Start pan - track last mouse position in screen coords
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      setIsDrawing(false);
    } else if (tool === 'freedraw') {
      setIsDrawing(true);
      setPoints([{ x, y }]);
    } else if (tool === 'text') {
      setTextPosition({ x, y });
      setIsTyping(true);
      setTimeout(() => inputRef.current?.focus(), 0);
      setIsDrawing(false);
    } else {
      setIsDrawing(true);
    }
  };

  // Handle mouse move (draw or pan)
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    // Pan the canvas
    if (tool === 'hand' && lastPanPoint) {
      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      redrawCanvas();
      return;
    }

    if (!isDrawing) return;

    if (tool === 'freedraw') {
      setPoints(prevPoints => {
        const newPoints = [...prevPoints, { x, y }];
        // Draw freehand line immediately for smooth feedback
        const ctx = canvasRef.current!.getContext('2d');
        if (ctx) {
          redrawCanvas();
          ctx.save();
          ctx.translate(offset.x, offset.y);
          ctx.scale(scale, scale);
          ctx.beginPath();
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          ctx.moveTo(newPoints[0].x, newPoints[0].y);
          newPoints.forEach(p => ctx.lineTo(p.x, p.y));
          ctx.stroke();
          ctx.restore();
        }
        return newPoints;
      });
      return;
    }

    // For shape drawing (rectangle, ellipse, line, arrow)
    if (tool !== 'selection' && tool !== 'hand' && tool !== 'text' && startPoint) {
      const elementsCopy = [...elements];
      const tempIndex = elementsCopy.findIndex(el => el.id === 'temp');

      const newElement: Element = {
        id: 'temp',
        type: tool,
        x: Math.min(startPoint.x, x),
        y: Math.min(startPoint.y, y),
        width: Math.abs(x - startPoint.x),
        height: Math.abs(y - startPoint.y),
        strokeColor: '#000000',
        backgroundColor: 'transparent',
        strokeWidth: 1,
        opacity: 1,
        roughness: 1,
        angle: 0,
      };

      if (tool === 'line' || tool === 'arrow') {
        newElement.x = startPoint.x;
        newElement.y = startPoint.y;
        newElement.points = [{ x: 0, y: 0 }, { x: x - startPoint.x, y: y - startPoint.y }];
      }

      if (tempIndex === -1) {
        elementsCopy.push(newElement);
      } else {
        elementsCopy[tempIndex] = newElement;
      }
      setElements(elementsCopy);
      redrawCanvas();
    }
  };

  // Handle mouse up (finish drawing or pan)
  const handleMouseUp = () => {
    if (tool === 'hand') {
      setLastPanPoint(null);
      return; // no elements changed on pan end
    }

    if (!isDrawing) return;

    if (tool === 'freedraw' && points.length > 1) {
      const newElement: Element = {
        id: generateId(),
        type: 'freedraw',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        strokeColor: '#000000',
        backgroundColor: 'transparent',
        strokeWidth: 1,
        opacity: 1,
        roughness: 1,
        points: [...points],
        angle: 0,
      };
      setElements(elements.filter(el => el.id !== 'temp').concat(newElement));
    } else if (tool !== 'selection' && tool !== 'hand' && tool !== 'text') {
      setElements(elements.map(el => (el.id === 'temp' ? { ...el, id: generateId() } : el)));
    }

    setIsDrawing(false);
    setStartPoint(null);
    setPoints([]);
    redrawCanvas();
  };

  const findElementAtPosition = (x: number, y: number) => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (
        x >= el.x &&
        x <= el.x + el.width &&
        y >= el.y &&
        y <= el.y + el.height
      ) {
        return el;
      }
    }
    return null;
  };

  const handleTextSubmit = (e: React.KeyboardEvent | React.FocusEvent) => {
    if (!textPosition || !inputRef.current) return;
    const text = inputRef.current.value.trim();
    if (text === '') {
      setIsTyping(false);
      setTextPosition(null);
      return;
    }

    const newElement: Element = {
      id: generateId(),
      type: 'text',
      x: textPosition.x,
      y: textPosition.y,
      width: 100,
      height: 20,
      strokeColor: '#000000',
      backgroundColor: 'transparent',
      strokeWidth: 1,
      opacity: 1,
      roughness: 1,
      angle: 0,
      text,
      fontSize: 16,
      fontFamily: 'sans-serif',
      textAlign: 'left',
    };

    setElements([...elements, newElement]);
    setIsTyping(false);
    setTextPosition(null);
  };

  return (
    <div
      ref={wrapperRef}
      className="flex-1 bg-gray-50 overflow-hidden relative"
      onWheel={(e) => {
        e.preventDefault();
        const newScale = e.deltaY < 0 ? scale * 1.1 : scale / 1.1;
        setScale(Math.min(10, Math.max(0.1, newScale)));
      }}
    >
      <canvas
        ref={canvasRef}
        className="touch-none cursor-crosshair absolute top-0 left-0 w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {isTyping && (
        <textarea
          ref={inputRef}
          className="absolute p-1 border border-gray-300 resize-none"
          style={{
            top: textPosition!.y * scale + offset.y,
            left: textPosition!.x * scale + offset.x,
            fontSize: 16,
            width: 200,
            height: 40,
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
          }}
          onBlur={handleTextSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleTextSubmit(e);
            }
          }}
        />
      )}
    </div>
  );
};

export default Canvas;
