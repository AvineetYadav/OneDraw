import { Element } from '../types';

export const renderElement = (ctx: CanvasRenderingContext2D, element: Element) => {
  ctx.save();
  
  // Set common styles
  ctx.strokeStyle = element.strokeColor;
  ctx.fillStyle = element.backgroundColor;
  ctx.lineWidth = element.strokeWidth;
  ctx.globalAlpha = element.opacity;
  
  // Apply rotation if needed
  if (element.angle !== 0) {
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((element.angle * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
  }
  
  // Render based on element type
  switch (element.type) {
    case 'rectangle':
      renderRectangle(ctx, element);
      break;
    case 'ellipse':
      renderEllipse(ctx, element);
      break;
    case 'line':
      renderLine(ctx, element);
      break;
    case 'arrow':
      renderArrow(ctx, element);
      break;
    case 'text':
      renderText(ctx, element);
      break;
    case 'freedraw':
      renderFreedraw(ctx, element);
      break;
  }
  
  ctx.restore();
};

const renderRectangle = (ctx: CanvasRenderingContext2D, element: Element) => {
  ctx.beginPath();
  ctx.rect(element.x, element.y, element.width, element.height);
  
  if (element.backgroundColor !== 'transparent') {
    ctx.fill();
  }
  
  ctx.stroke();
};

const renderEllipse = (ctx: CanvasRenderingContext2D, element: Element) => {
  const centerX = element.x + element.width / 2;
  const centerY = element.y + element.height / 2;
  const radiusX = element.width / 2;
  const radiusY = element.height / 2;
  
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  
  if (element.backgroundColor !== 'transparent') {
    ctx.fill();
  }
  
  ctx.stroke();
};

const renderLine = (ctx: CanvasRenderingContext2D, element: Element) => {
  if (!element.points || element.points.length < 2) return;
  
  const [start, end] = element.points;
  
  ctx.beginPath();
  ctx.moveTo(element.x + start.x, element.y + start.y);
  ctx.lineTo(element.x + end.x, element.y + end.y);
  ctx.stroke();
};

const renderArrow = (ctx: CanvasRenderingContext2D, element: Element) => {
  if (!element.points || element.points.length < 2) return;
  
  const [start, end] = element.points;
  const startX = element.x + start.x;
  const startY = element.y + start.y;
  const endX = element.x + end.x;
  const endY = element.y + end.y;
  
  // Draw the line
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  
  // Draw the arrowhead
  const angle = Math.atan2(endY - startY, endX - startX);
  const arrowSize = 10;
  
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - arrowSize * Math.cos(angle - Math.PI / 6),
    endY - arrowSize * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    endX - arrowSize * Math.cos(angle + Math.PI / 6),
    endY - arrowSize * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
};

const renderText = (ctx: CanvasRenderingContext2D, element: Element) => {
  if (!element.text) return;
  
  ctx.font = `${element.fontSize}px ${element.fontFamily}`;
  ctx.fillStyle = element.strokeColor;
  ctx.fillText(element.text, element.x, element.y + element.fontSize!);
};

const renderFreedraw = (ctx: CanvasRenderingContext2D, element: Element) => {
  if (!element.points || element.points.length < 2) return;
  
  ctx.beginPath();
  ctx.moveTo(element.points[0].x, element.points[0].y);
  
  element.points.forEach((point) => {
    ctx.lineTo(point.x, point.y);
  });
  
  ctx.stroke();
};