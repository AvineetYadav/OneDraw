import React from 'react';
import { useElements } from '../context/ElementContext';

interface StrokeWidthPickerProps {
  disabled: boolean;
}

const strokeWidths = [1, 2, 4, 8];

const StrokeWidthPicker: React.FC<StrokeWidthPickerProps> = ({ disabled }) => {
  const { selectedElement, updateElement } = useElements();
  
  const handleStrokeWidthChange = (width: number) => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, { strokeWidth: width });
  };

  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1">Stroke Width</label>
      <div className="flex space-x-2">
        {strokeWidths.map(width => (
          <button
            key={width}
            className={`w-8 h-8 flex items-center justify-center rounded border ${
              selectedElement?.strokeWidth === width 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:bg-gray-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => !disabled && handleStrokeWidthChange(width)}
            disabled={disabled}
          >
            <div 
              className="bg-black rounded-full" 
              style={{ 
                width: Math.min(width * 2, 16),
                height: Math.min(width * 2, 16)
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StrokeWidthPicker;