import React, { useState } from 'react';
import { Save, Play, Settings, Download, Upload, Trash2, ArrowLeft, MessageCircle, Menu, X } from 'lucide-react';

interface HeaderProps {
  onSave?: () => void;
  onRun?: () => void;
  onSettings?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onClear?: () => void;
  onBackToWelcome?: () => void;
  onOpenChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSave,
  onRun,
  onSettings,
  onExport,
  onImport,
  onClear,
  onBackToWelcome,
  onOpenChat
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          {onBackToWelcome && (
            <button
              onClick={onBackToWelcome}
              className="flex items-center gap-2 px-2 sm:px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Voltar</span>
            </button>
          )}
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm"></div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">PayFlow Builder</h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Constructor de Fluxos de Pagamento</p>
            </div>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-3 py-2 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <MessageCircle size={16} />
              Assistente IA
            </button>
          )}

          <button
            onClick={onImport}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Upload size={16} />
            Importar
          </button>
          
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Download size={16} />
            Exportar
          </button>

          <div className="w-px h-6 bg-gray-200 mx-2"></div>

          <button
            onClick={onClear}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            Limpar
          </button>

          <button
            onClick={onSettings}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings size={16} />
            Configurações
          </button>

          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors font-medium"
          >
            <Save size={16} />
            Salvar
          </button>

          <button
            onClick={onRun}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors font-medium"
          >
            <Play size={16} />
            Executar
          </button>
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-2">
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <MessageCircle size={20} />
            </button>
          )}

          <button
            onClick={onSave}
            className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors font-medium"
          >
            <Save size={16} />
            <span className="hidden sm:inline">Salvar</span>
          </button>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onRun?.();
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors font-medium"
            >
              <Play size={16} />
              Executar
            </button>

            <button
              onClick={() => {
                onImport?.();
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Upload size={16} />
              Importar
            </button>

            <button
              onClick={() => {
                onExport?.();
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Download size={16} />
              Exportar
            </button>

            <button
              onClick={() => {
                onSettings?.();
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Settings size={16} />
              Config
            </button>

            <button
              onClick={() => {
                onClear?.();
                setShowMobileMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors col-span-2"
            >
              <Trash2 size={16} />
              Limpar Fluxo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};