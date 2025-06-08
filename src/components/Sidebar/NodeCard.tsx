import React from 'react';
import * as LucideIcons from 'lucide-react';
import { NodeTemplate } from '../../types/flowTypes';

interface NodeCardProps {
  template: NodeTemplate;
}

export const NodeCard: React.FC<NodeCardProps> = ({ template }) => {
  const IconComponent = LucideIcons[template.icon as keyof typeof LucideIcons] as React.ComponentType<any>;

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(template));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="group relative bg-white border border-gray-200 rounded-xl p-3 sm:p-4 cursor-grab hover:shadow-md transition-all duration-200 hover:border-orange-300 active:cursor-grabbing"
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div 
          className="p-2 sm:p-2.5 rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform"
          style={{ backgroundColor: template.color }}
        >
          <IconComponent size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate mb-1">
            {template.label}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
};