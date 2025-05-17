export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const downloadCanvasAsImage = (canvas: HTMLCanvasElement, filename = 'excalidraw-drawing.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const saveDrawingAsJSON = (elements: any[], filename = 'excalidraw-drawing.json') => {
  const data = JSON.stringify(elements);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const loadDrawingFromJSON = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const elements = JSON.parse(event.target?.result as string);
        resolve(elements);
      } catch (err) {
        reject(new Error('Invalid file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};