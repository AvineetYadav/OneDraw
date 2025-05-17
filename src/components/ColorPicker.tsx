import React, { useState } from 'react';
import { useElements } from '../context/ElementContext';

interface ColorPickerProps {
  label: 'Stroke' | 'Fill';
  disabled: boolean;
}

const colors = [
  '#1e1e1e', '#d0021b', '#f5a623', '#f8e71c', 
  '#8b572a', '#7ed321', '#417505', '#bd10e0',
  '#9013fe', '#4a90e2', '#50e3c2', '#b8e986',
  '#000000', '#4a4a4a', '#9b9b9b', '#ffffff',
];

const ColorPicker: React.FC<ColorPickerProps> = ({ label, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedElement, updateElement } = useElements();
  
  const currentColor = label === 'Stroke' 
    ? selectedElement?.strokeColor || '#000000'
    : selectedElement?.backgroundColor || 'transparent';

  const handleColorChange = (color: string) => {
    if (!selectedElement) return;
    
    if (label === 'Stroke') {
      updateElement(selectedElement.id, { strokeColor: color });
    } else {
      updateElement(selectedElement.id, { backgroundColor: color });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm text-gray-700">{label}</label>
        <div 
          className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
          style={{ 
            backgroundColor: currentColor === 'transparent' ? 'white' : currentColor,
            backgroundImage: currentColor === 'transparent' 
              ? 'linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd), linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd)'
              : 'none',
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 4px 4px'
          }}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 p-2 bg-white rounded-md shadow-lg border border-gray-200 grid grid-cols-4 gap-1 w-32">
          <button
            className="w-6 h-6 rounded border border-gray-300"
            style={{
              backgroundImage: 'linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd), linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd)',
              backgroundSize: '8px 8px',
              backgroundPosition: '0 0, 4px 4px'
            }}
            onClick={() => handleColorChange('transparent')}
          />
          {colors.map(color => (
            <button
              key={color}
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;