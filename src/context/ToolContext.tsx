import React, { createContext, useContext, useState } from 'react';
import { ToolType } from '../types';

type ToolContextType = {
  tool: ToolType;
  setTool: React.Dispatch<React.SetStateAction<ToolType>>;
};

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export const ToolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tool, setTool] = useState<ToolType>('selection');

  return (
    <ToolContext.Provider value={{ tool, setTool }}>
      {children}
    </ToolContext.Provider>
  );
};

export const useTool = () => {
  const context = useContext(ToolContext);
  if (context === undefined) {
    throw new Error('useTool must be used within a ToolProvider');
  }
  return context;
};