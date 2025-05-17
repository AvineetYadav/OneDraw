import React from 'react';
import { useTool } from '../context/ToolContext';
import { useElements } from '../context/ElementContext';
import { Square, Circle, Type, MousePointer, Pencil, ArrowRight, MoreHorizontal as LineHorizontal, Hand } from 'lucide-react';
import ColorPicker from './ColorPicker';
import StrokeWidthPicker from './StrokeWidthPicker';

const tools = [
  { type: 'selection', icon: <MousePointer size={18} />, name: 'Selection' },
  { type: 'hand', icon: <Hand size={18} />, name: 'Hand Tool' },
  { type: 'rectangle', icon: <Square size={18} />, name: 'Rectangle' },
  { type: 'ellipse', icon: <Circle size={18} />, name: 'Ellipse' },
  { type: 'line', icon: <LineHorizontal size={18} />, name: 'Line' },
  { type: 'arrow', icon: <ArrowRight size={18} />, name: 'Arrow' },
  { type: 'text', icon: <Type size={18} />, name: 'Text' },
  { type: 'freedraw', icon: <Pencil size={18} />, name: 'Pencil' },
];

const Toolbar: React.FC = () => {
  const { tool, setTool } = useTool();
  const { selectedElement, setElements } = useElements();

  const handleClearCanvas = () => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      setElements([]);
    }
  };

  return (
    <div className="w-56 bg-white border-r border-gray-200 p-2 flex flex-col">
      <div className="space-y-1 mb-4">
        {tools.map((t) => (
          <button
            key={t.type}
            className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
              tool === t.type ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setTool(t.type)}
            title={t.name}
          >
            <span className="mr-2">{t.icon}</span>
            <span className="text-sm">{t.name}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-3 mt-2">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          Properties
        </h3>
        
        <div className="space-y-3">
          <ColorPicker label="Stroke" disabled={!selectedElement} />
          <ColorPicker label="Fill" disabled={!selectedElement} />
          <StrokeWidthPicker disabled={!selectedElement} />
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
          className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          onClick={handleClearCanvas}
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
};

export default Toolbar;