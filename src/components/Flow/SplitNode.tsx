import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { GitBranch, Settings, Plus, Trash2, Percent } from 'lucide-react';

interface SplitNodeProps {
  data: {
    label: string;
    description: string;
    icon: string;
    color: string;
    config?: {
      splits: Array<{
        id: string;
        percentage: number;
        destination: string;
        description: string;
      }>;
    };
  };
  selected?: boolean;
  id: string;
}

export const SplitNode: React.FC<SplitNodeProps> = ({ data, selected, id }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [splits, setSplits] = useState(data.config?.splits || [
    { id: '1', percentage: 50, destination: 'Conta Principal', description: 'Recebimento principal' },
    { id: '2', percentage: 50, destination: 'Conta Secundária', description: 'Comissão/Taxa' }
  ]);

  const totalPercentage = splits.reduce((sum, split) => sum + split.percentage, 0);

  // Atualizar dados do nó quando splits mudarem
  useEffect(() => {
    if (window.updateNodeData) {
      window.updateNodeData(id, {
        ...data,
        config: {
          ...data.config,
          splits: splits
        }
      });
    }
  }, [splits, id, data]);

  const addSplit = () => {
    const newSplit = {
      id: Date.now().toString(),
      percentage: 0,
      destination: 'Nova Conta',
      description: 'Descrição da divisão'
    };
    setSplits([...splits, newSplit]);
  };

  const removeSplit = (id: string) => {
    if (splits.length > 2) {
      setSplits(splits.filter(split => split.id !== id));
    }
  };

  const updateSplit = (id: string, field: string, value: any) => {
    setSplits(splits.map(split => 
      split.id === id ? { ...split, [field]: value } : split
    ));
  };

  const balanceSplits = () => {
    const equalPercentage = Math.floor(100 / splits.length);
    const remainder = 100 - (equalPercentage * splits.length);
    
    setSplits(splits.map((split, index) => ({
      ...split,
      percentage: index === 0 ? equalPercentage + remainder : equalPercentage
    })));
  };

  const saveConfiguration = () => {
    if (totalPercentage === 100) {
      // Atualizar edges com novos percentuais
      if (window.updateSplitEdges) {
        window.updateSplitEdges(id, splits);
      }
      setShowConfig(false);
    }
  };

  if (showConfig) {
    return (
      <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-xl min-w-[400px] max-w-[500px] overflow-hidden">
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !border-2 !border-blue-400 !bg-white hover:!border-blue-500 !-top-1.5"
        />

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500">
                <GitBranch size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Configurar Split</h3>
                <p className="text-sm text-blue-600 font-medium">Divisão de valores</p>
              </div>
            </div>
            <button 
              onClick={() => setShowConfig(false)}
              className="p-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Settings size={18} className="text-blue-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-blue-600">Configuração de Divisão</h4>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              totalPercentage === 100 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              Total: {totalPercentage}%
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {splits.map((split, index) => (
              <div key={split.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-700">Divisão {index + 1}</span>
                  </div>
                  {splits.length > 2 && (
                    <button
                      onClick={() => removeSplit(split.id)}
                      className="p-1 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Percentual
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={split.percentage}
                        onChange={(e) => updateSplit(split.id, 'percentage', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <Percent size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Destino
                    </label>
                    <input
                      type="text"
                      value={split.destination}
                      onChange={(e) => updateSplit(split.id, 'destination', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={split.description}
                    onChange={(e) => updateSplit(split.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Descrição da divisão"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={addSplit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
            >
              <Plus size={16} />
              Adicionar Divisão
            </button>
            <button
              onClick={balanceSplits}
              className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
            >
              <Percent size={16} />
              Equilibrar
            </button>
          </div>

          {totalPercentage !== 100 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-yellow-700 text-sm">
                ⚠️ O total deve ser exatamente 100%. Ajuste os percentuais.
              </p>
            </div>
          )}

          <button
            onClick={saveConfiguration}
            disabled={totalPercentage !== 100}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar Configuração
          </button>
        </div>

        {/* Multiple Handles for outputs */}
        {splits.map((split, index) => (
          <Handle
            key={split.id}
            type="source"
            position={Position.Bottom}
            id={split.id}
            className="w-3 h-3 !border-2 !border-blue-400 !bg-white hover:!border-blue-500"
            style={{ 
              left: `${20 + (index * (60 / Math.max(splits.length - 1, 1)))}%`,
              bottom: -6
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`
        bg-white rounded-xl border-2 min-w-[280px] max-w-[320px] transition-all duration-200 shadow-sm cursor-pointer
        ${selected 
          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
          : 'border-blue-200 hover:border-blue-400 hover:shadow-md'
        }
      `}
      onClick={() => setShowConfig(true)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !border-2 !border-blue-400 !bg-white hover:!border-blue-500 !-top-1.5"
      />

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg flex-shrink-0 bg-blue-500">
              <GitBranch size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base leading-tight">
                {data.label}
              </h3>
            </div>
          </div>
          
          <Settings size={16} className="text-gray-400" />
        </div>
        
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {data.description}
        </p>

        {/* Split Preview */}
        <div className="space-y-2">
          {splits.slice(0, 2).map((split, index) => (
            <div key={split.id} className="flex items-center justify-between text-xs">
              <span className="text-gray-500 truncate">{split.destination}</span>
              <span className="font-medium text-blue-600">{split.percentage}%</span>
            </div>
          ))}
          {splits.length > 2 && (
            <div className="text-xs text-gray-400 text-center">
              +{splits.length - 2} mais divisões
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs mt-3">
          <div className={`w-2 h-2 rounded-full ${totalPercentage === 100 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-gray-500">
            {totalPercentage === 100 ? 'Configurado' : 'Requer configuração'}
          </span>
        </div>
      </div>

      {/* Multiple Handles for outputs */}
      {splits.map((split, index) => (
        <Handle
          key={split.id}
          type="source"
          position={Position.Bottom}
          id={split.id}
          className="w-3 h-3 !border-2 !border-blue-400 !bg-white hover:!border-blue-500"
          style={{ 
            left: `${20 + (index * (60 / Math.max(splits.length - 1, 1)))}%`,
            bottom: -6
          }}
        />
      ))}
    </div>
  );
};