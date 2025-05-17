import React from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import { ElementProvider } from './context/ElementContext';
import { ToolProvider } from './context/ToolContext';

function App() {
  return (
    <ToolProvider>
      <ElementProvider>
        <div className="min-h-screen flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-4 py-2">
            <h1 className="text-xl font-semibold text-gray-800">Excalidraw Clone</h1>
          </header>
          <main className="flex-1 flex overflow-hidden">
            <Toolbar />
            <Canvas />
          </main>
        </div>
      </ElementProvider>
    </ToolProvider>
  );
}

export default App;