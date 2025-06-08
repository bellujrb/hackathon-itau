import React from 'react';
import { Handle, Position } from 'reactflow';
import * as LucideIcons from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';

interface CustomNodeProps {
  data: {
    label: string;
    description: string;
    icon: string;
    color: string;
    config?: Record<string, any>;
  };
  selected?: boolean;
}

export const CustomNode: React.FC<CustomNodeProps> = ({ data, selected }) => {
  const IconComponent = LucideIcons[data.icon as keyof typeof LucideIcons] as React.ComponentType<any>;

  return (
    <div className={`
      bg-white rounded-xl border-2 min-w-[240px] sm:min-w-[280px] max-w-[280px] sm:max-w-[320px] transition-all duration-200 shadow-sm
      ${selected 
        ? 'border-orange-500 shadow-lg shadow-orange-500/20' 
        : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
      }
    `}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !border-2 !border-orange-400 !bg-white hover:!border-orange-500 !-top-1.5"
      />

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div 
              className="p-2 sm:p-2.5 rounded-lg flex-shrink-0"
              style={{ backgroundColor: data.color }}
            >
              <IconComponent size={18} className="sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
                {data.label}
              </h3>
            </div>
          </div>
          
          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <MoreHorizontal size={14} className="sm:w-4 sm:h-4 text-gray-400" />
          </button>
        </div>
        
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
          {data.description}
        </p>

        {data.config && Object.keys(data.config).length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-500">Configurado</span>
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