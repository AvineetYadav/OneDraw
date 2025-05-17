import React, { createContext, useContext, useState } from 'react';
import { Element } from '../types';

type ElementContextType = {
  elements: Element[];
  setElements: React.Dispatch<React.SetStateAction<Element[]>>;
  selectedElement: Element | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<Element | null>>;
  updateElement: (id: string, props: Partial<Element>) => void;
};

const ElementContext = createContext<ElementContextType | undefined>(undefined);

export const ElementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const updateElement = (id: string, props: Partial<Element>) => {
    setElements(prevElements => 
      prevElements.map(el => 
        el.id === id ? { ...el, ...props } : el
      )
    );
    
    // Update selected element if it's the one being modified
    if (selectedElement && selectedElement.id === id) {
      setSelectedElement(prev => prev ? { ...prev, ...props } : null);
    }
  };

  return (
    <ElementContext.Provider 
      value={{ 
        elements, 
        setElements, 
        selectedElement, 
        setSelectedElement,
        updateElement
      }}
    >
      {children}
    </ElementContext.Provider>
  );
};

export const useElements = () => {
  const context = useContext(ElementContext);
  if (context === undefined) {
    throw new Error('useElements must be used within an ElementProvider');
  }
  return context;
};