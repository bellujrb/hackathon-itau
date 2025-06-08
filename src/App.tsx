import React, { useState, useRef } from 'react';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { FlowCanvasWithProvider } from './components/Flow/FlowCanvas';
import { WelcomeScreen } from './components/Welcome/WelcomeScreen';
import { ChatBot } from './components/Chat/ChatBot';
import { FlowTemplate } from './types/flowTypes';

type AppView = 'welcome' | 'builder';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hasNodes, setHasNodes] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const flowCanvasRef = useRef<{ clearFlow: () => void; loadTemplate: (template: FlowTemplate) => void }>(null);

  const handleSave = () => {
    console.log('Saving flow...');
    // Implement save functionality
  };

  const handleRun = () => {
    console.log('Running flow...');
    // Implement run functionality
  };

  const handleSettings = () => {
    console.log('Opening settings...');
    // Implement settings functionality
  };

  const handleExport = () => {
    console.log('Exporting flow...');
    // Implement export functionality
  };

  const handleImport = () => {
    console.log('Importing flow...');
    // Implement import functionality
  };

  const handleClear = () => {
    console.log('Clearing flow...');
    flowCanvasRef.current?.clearFlow();
  };

  const handleCreateFromTemplate = (template: FlowTemplate) => {
    setCurrentView('builder');
    setTimeout(() => {
      flowCanvasRef.current?.loadTemplate(template);
    }, 100);
  };

  const handleCreateFromScratch = () => {
    setCurrentView('builder');
  };

  const handleCreateFlowFromAI = (description: string) => {
    // Generate a simple flow based on AI description
    const aiTemplate: FlowTemplate = {
      id: 'ai-generated',
      name: 'Fluxo Gerado por IA',
      description: description,
      category: 'IA',
      thumbnail: '',
      complexity: 'Intermediário',
      estimatedTime: '10 min',
      tags: ['IA', 'Personalizado'],
      nodes: [
        {
          id: 'trigger-ai',
          type: 'custom',
          position: { x: 250, y: 50 },
          data: {
            label: 'Acionador',
            description: 'Ativa o processo de checkout',
            icon: 'Play',
            color: '#4F46E5'
          }
        },
        {
          id: 'cobranca-ai',
          type: 'custom',
          position: { x: 250, y: 200 },
          data: {
            label: 'Cobrança',
            description: 'Geração de invoice',
            icon: 'CreditCard',
            color: '#3B82F6'
          }
        }
      ],
      edges: [
        { id: 'e1-2', source: 'trigger-ai', target: 'cobranca-ai' }
      ]
    };

    setCurrentView('builder');
    setIsChatOpen(false);
    setTimeout(() => {
      flowCanvasRef.current?.loadTemplate(aiTemplate);
    }, 100);
  };

  const handleBackToWelcome = () => {
    setCurrentView('welcome');
    setHasNodes(false);
    // Auto-collapse sidebar on mobile when going back
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  };

  // Auto-collapse sidebar on mobile when entering builder
  React.useEffect(() => {
    if (currentView === 'builder' && window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  }, [currentView]);

  if (currentView === 'welcome') {
    return (
      <>
        <WelcomeScreen
          onCreateFromTemplate={handleCreateFromTemplate}
          onCreateFromScratch={handleCreateFromScratch}
          onOpenChat={() => setIsChatOpen(true)}
        />
        <ChatBot
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onCreateFlow={handleCreateFlowFromAI}
        />
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        onSave={handleSave}
        onRun={handleRun}
        onSettings={handleSettings}
        onExport={handleExport}
        onImport={handleImport}
        onClear={handleClear}
        onBackToWelcome={handleBackToWelcome}
        onOpenChat={() => setIsChatOpen(true)}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="flex-1 relative">
          <FlowCanvasWithProvider 
            ref={flowCanvasRef}
            className="h-full" 
            onNodesChange={setHasNodes}
          />
          
          {/* Welcome overlay when canvas is empty */}
          {!hasNodes && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
              <div className="text-center max-w-md">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg"></div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Construa seu Fluxo de Pagamento
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  Arraste os componentes da barra lateral para criar um fluxo personalizado. 
                  Conecte-os para definir a sequência de execução.
                </p>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-orange-600 bg-orange-50 px-3 sm:px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  Comece arrastando um "Acionador"
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <ChatBot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onCreateFlow={handleCreateFlowFromAI}
      />
    </div>
  );
}

export default App;