import React, { useState } from 'react';
import { nodeTemplates } from '../../data/nodeTemplates';
import { NodeCard } from './NodeCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = {
    trigger: 'Acionadores',
    payment: 'Pagamentos',
    integration: 'Integrações',
    notification: 'Notificações',
    control: 'Controle'
  };

  const groupedNodes = nodeTemplates.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<string, typeof nodeTemplates>);

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      <div className={`
        bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full
        ${isCollapsed 
          ? 'w-12 sm:w-16' 
          : 'fixed lg:relative inset-y-0 left-0 z-50 w-80 sm:w-80 lg:w-80'
        }
      `}>
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-base sm:text-lg font-bold text-gray-800">Componentes</h2>
            )}
            <button
              onClick={onToggle}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight size={16} className="text-gray-600" />
              ) : (
                <ChevronLeft size={16} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto">
            {/* Mobile Category Selector */}
            <div className="lg:hidden p-4 border-b border-gray-200">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              >
                <option value="">Todas as categorias</option>
                {Object.entries(categories).map(([category, title]) => (
                  <option key={category} value={category}>{title}</option>
                ))}
              </select>
            </div>

            {/* Desktop Categories */}
            <div className="hidden lg:block p-4 space-y-6">
              {Object.entries(categories).map(([category, title]) => (
                <div key={category}>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                    {title}
                  </h3>
                  <div className="space-y-2">
                    {groupedNodes[category]?.map((template) => (
                      <NodeCard key={template.type} template={template} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Category Content */}
            <div className="lg:hidden p-4">
              {selectedCategory ? (
                <div className="space-y-2">
                  {groupedNodes[selectedCategory]?.map((template) => (
                    <NodeCard key={template.type} template={template} />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(categories).map(([category, title]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                        {title}
                      </h3>
                      <div className="space-y-2">
                        {groupedNodes[category]?.slice(0, 2).map((template) => (
                          <NodeCard key={template.type} template={template} />
                        ))}
                        {groupedNodes[category]?.length > 2 && (
                          <button
                            onClick={() => setSelectedCategory(category)}
                            className="w-full p-3 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors border border-orange-200"
                          >
                            Ver mais {groupedNodes[category].length - 2} componentes
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};