import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Link2, ChevronLeft, X, Settings } from 'lucide-react';

interface IntegrationNodeProps {
  data: {
    label: string;
    description: string;
    icon: string;
    color: string;
    config?: Record<string, any>;
  };
  selected?: boolean;
}

interface Integration {
  name: string;
  color: string;
  description: string;
}

const integrationOptions: Integration[] = [
  {
    name: 'SAP',
    color: '#0073E6',
    description: 'Sistema integrado de gestão empresarial'
  },
  {
    name: 'Omie',
    color: '#00D4AA',
    description: 'ERP online para pequenas e médias empresas'
  },
  {
    name: 'TOTVS',
    color: '#1E3A8A',
    description: 'Plataforma de tecnologia para gestão empresarial'
  }
];

export const IntegrationNode: React.FC<IntegrationNodeProps> = ({ data, selected }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [configuredIntegrations, setConfiguredIntegrations] = useState<string[]>([]);

  const handleIntegrationClick = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowModal(true);
    setIsExpanded(false);
  };

  const handleConfigSave = () => {
    if (selectedIntegration && !configuredIntegrations.includes(selectedIntegration.name)) {
      setConfiguredIntegrations([...configuredIntegrations, selectedIntegration.name]);
    }
    setShowModal(false);
    setSelectedIntegration(null);
  };

  if (isExpanded) {
    return (
      <>
        <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-xl min-w-[350px] sm:min-w-[420px] max-w-[380px] sm:max-w-[450px] overflow-hidden">
          <Handle
            type="target"
            position={Position.Top}
            className="w-3 h-3 !border-2 !border-orange-400 !bg-white hover:!border-orange-500 !-top-1.5"
          />

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-orange-200">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-orange-200 transition-colors"
              >
                <ChevronLeft size={18} className="sm:w-5 sm:h-5 text-orange-600" />
              </button>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-2.5 rounded-lg bg-orange-500">
                  <Link2 size={18} className="sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg">Integração</h3>
                  <p className="text-xs sm:text-sm text-orange-600 font-medium">Integração para conciliação financeira</p>
                </div>
              </div>

              <button 
                onClick={() => setIsExpanded(false)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-orange-200 transition-colors"
              >
                <X size={18} className="sm:w-5 sm:h-5 text-orange-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <h4 className="text-base sm:text-lg font-bold text-orange-600 mb-4 sm:mb-6">Integrações sugeridas</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {integrationOptions.map((integration, index) => (
                <button
                  key={index}
                  className="bg-gray-50 rounded-xl p-3 sm:p-4 hover:bg-orange-50 transition-all duration-200 border border-gray-200 hover:border-orange-300 hover:shadow-md group"
                  onClick={() => handleIntegrationClick(integration)}
                >
                  <div className="h-10 sm:h-12 flex items-center justify-center mb-2 sm:mb-3">
                    <div 
                      className="w-full h-6 sm:h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-sm group-hover:shadow-md transition-shadow"
                      style={{ backgroundColor: integration.color }}
                    >
                      {integration.name}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 text-center leading-tight">
                    {integration.description}
                  </p>
                </button>
              ))}
            </div>

            {configuredIntegrations.length > 0 && (
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Integrações configuradas:</h5>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {configuredIntegrations.map((name) => (
                    <span key={name} className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Handle
            type="source"
            position={Position.Bottom}
            className="w-3 h-3 !border-2 !border-orange-400 !bg-white hover:!border-orange-500 !-bottom-1.5"
          />
        </div>

        {/* Modal */}
        {showModal && selectedIntegration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-white">Configurar {selectedIntegration.name}</h3>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="p-1 rounded-lg hover:bg-orange-400 transition-colors"
                  >
                    <X size={18} className="sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL da API
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                    placeholder="https://api.exemplo.com"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Token de Acesso
                  </label>
                  <input 
                    type="password" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                    placeholder="••••••••••••••••"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ambiente
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base">
                    <option>Produção</option>
                    <option>Homologação</option>
                    <option>Desenvolvimento</option>
                  </select>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleConfigSave}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm sm:text-base"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div 
      className={`
        bg-white rounded-xl border-2 min-w-[240px] sm:min-w-[280px] max-w-[280px] sm:max-w-[320px] transition-all duration-200 shadow-sm
        ${selected 
          ? 'border-orange-500 shadow-lg shadow-orange-500/20' 
          : 'border-orange-200 hover:border-orange-400 hover:shadow-md'
        }
      `}
      onMouseUp={() => setIsExpanded(true)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !border-2 !border-orange-400 !bg-white hover:!border-orange-500 !-top-1.5"
      />

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg flex-shrink-0 bg-orange-500">
              <Link2 size={18} className="sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
                {data.label}
              </h3>
            </div>
          </div>
          
          <div className="flex gap-1">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-400 rounded-full"></div>
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-400 rounded-full"></div>
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-400 rounded-full"></div>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
          {data.description}
        </p>

        {configuredIntegrations.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-500">{configuredIntegrations.length} integração(ões) configurada(s)</span>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !border-2 !border-orange-400 !bg-white hover:!border-orange-500 !-bottom-1.5"
      />
    </div>
  );
};