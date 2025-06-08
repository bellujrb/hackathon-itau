import React, { useState } from 'react';
import { Play, Plus, MessageCircle, Search, Filter, Clock, Tag, Zap, Menu } from 'lucide-react';
import { FlowTemplate } from '../../types/flowTypes';
import { flowTemplates } from '../../data/flowTemplates';

interface WelcomeScreenProps {
  onCreateFromTemplate: (template: FlowTemplate) => void;
  onCreateFromScratch: () => void;
  onOpenChat: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onCreateFromTemplate,
  onCreateFromScratch,
  onOpenChat
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Todos', 'Básico', 'Intermediário', 'Avançado'];
  
  const filteredTemplates = flowTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'Todos' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simples': return 'bg-green-100 text-green-700';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-700';
      case 'Avançado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-lg"></div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">PayFlow Builder</h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Construa fluxos de pagamento inteligentes</p>
              </div>
            </div>
            
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium text-sm sm:text-base"
            >
              <MessageCircle size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Assistente IA</span>
              <span className="sm:hidden">IA</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Como você gostaria de começar?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Escolha um template pronto ou crie seu fluxo personalizado do zero. 
            Nossa IA pode ajudar você a construir o fluxo perfeito.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onCreateFromScratch}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-orange-500 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors font-semibold"
            >
              <Plus size={20} />
              Criar do Zero
            </button>
            
            <button
              onClick={onOpenChat}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-colors font-semibold shadow-lg"
            >
              <Zap size={20} />
              Criar com IA
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
              />
            </div>
            
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between sm:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Filter size={16} />
                Filtros
              </button>
              <span className="text-sm text-gray-500">{filteredTemplates.length} templates</span>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-orange-300 transition-all duration-200 group"
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                    {template.complexity}
                  </span>
                </div>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <h3 className="text-white font-bold text-base sm:text-lg mb-1 line-clamp-2">{template.name}</h3>
                  <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
                    <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                    {template.estimatedTime}
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                  {template.description}
                </p>
                
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium"
                    >
                      <Tag size={10} className="sm:w-3 sm:h-3" />
                      {tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => onCreateFromTemplate(template)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium text-sm sm:text-base"
                >
                  <Play size={14} className="sm:w-4 sm:h-4" />
                  Usar Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={20} />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Nenhum template encontrado</h3>
            <p className="text-sm sm:text-base text-gray-600">Tente ajustar sua busca ou filtros</p>
          </div>
        )}
      </div>
    </div>
  );
};