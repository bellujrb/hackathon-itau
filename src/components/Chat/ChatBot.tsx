import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Lightbulb, Zap, MessageCircle, Loader2 } from 'lucide-react';
import { ChatMessage } from '../../types/flowTypes';
import { PerplexityService } from '../../services/perplexityService';
import { flowTemplates } from '../../data/flowTemplates';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFlow: (description: string) => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose, onCreateFlow }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Olá! Sou seu assistente de IA para criação de fluxos de pagamento. Descreva o tipo de fluxo que você precisa e eu vou analisar e criar automaticamente para você!',
      timestamp: new Date(),
      suggestions: [
        'Criar fluxo de cobrança simples',
        'Fluxo com split de pagamento',
        'Fluxo empresarial com aprovação',
        'Integração com ERP'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const perplexityService = useRef(new PerplexityService());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsAnalyzing(true);

    try {
      // Analisar com Perplexity AI
      const analysis = await perplexityService.current.analyzeFlowRequest(content);
      
      setIsAnalyzing(false);
      setIsTyping(true);

      // Simular delay de digitação
      setTimeout(async () => {
        let responseContent: string;
        let suggestions: string[] = [];

        if (analysis.isFlowRequest && analysis.confidence >= 0.5) {
          // Gerar resposta baseada na análise
          responseContent = await perplexityService.current.generateFlowSuggestion(analysis);
          
          // Criar fluxo automaticamente se tiver template sugerido
          if (analysis.suggestedTemplate) {
            const template = flowTemplates.find(t => t.id === analysis.suggestedTemplate);
            if (template) {
              setTimeout(() => {
                onCreateFlow(analysis.description);
              }, 2000);
              
              responseContent += `\n\n🚀 Criando seu fluxo automaticamente...`;
              suggestions = ['Ver fluxo criado', 'Personalizar fluxo', 'Criar outro fluxo'];
            }
          } else {
            // Criar fluxo personalizado
            setTimeout(() => {
              onCreateFlow(analysis.description);
            }, 2000);
            
            responseContent += `\n\n🎨 Criando fluxo personalizado...`;
            suggestions = ['Ver fluxo criado', 'Ajustar componentes', 'Adicionar mais funcionalidades'];
          }
        } else {
          // Resposta para solicitações não relacionadas a fluxos
          responseContent = generateGeneralResponse(content, analysis);
          suggestions = [
            'Criar fluxo básico de cobrança',
            'Fluxo com split de pagamento', 
            'Fluxo empresarial completo',
            'Explicar tipos de fluxo'
          ];
        }

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: responseContent,
          timestamp: new Date(),
          suggestions
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1500);

    } catch (error) {
      setIsAnalyzing(false);
      setIsTyping(false);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Desculpe, houve um erro ao analisar sua solicitação. Mas posso ajudar você a criar um fluxo! Pode me descrever o que você precisa?',
        timestamp: new Date(),
        suggestions: ['Criar fluxo básico', 'Fluxo com split', 'Fluxo empresarial']
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const generateGeneralResponse = (userInput: string, analysis: any) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('como') || input.includes('ajuda')) {
      return 'Posso ajudar você a criar fluxos de pagamento de forma automática! Basta me descrever:\n\n• Que tipo de cobrança você precisa\n• Se precisa dividir valores (split)\n• Se precisa aprovação manual\n• Se precisa integrar com ERP\n\nVou analisar e criar o fluxo ideal para você!';
    }
    
    if (input.includes('tipos') || input.includes('exemplos')) {
      return 'Posso criar diversos tipos de fluxos:\n\n🔹 **Básico**: Cobrança simples com notificação\n🔹 **Split**: Divisão automática entre contas\n🔹 **Empresarial**: Com aprovação e integração ERP\n🔹 **Personalizado**: Baseado nas suas necessidades\n\nQual tipo você precisa?';
    }
    
    return `Entendi sua mensagem, mas para criar um fluxo preciso de mais detalhes sobre o processo de pagamento que você quer automatizar. Pode me contar:\n\n• Qual o objetivo do fluxo?\n• Precisa de aprovação manual?\n• Vai dividir valores?\n• Precisa integrar com algum sistema?`;
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl h-[90vh] sm:h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="text-white" size={16} />
              </div>
              <div>
                <h3 className="text-white font-bold text-base sm:text-lg">Assistente IA</h3>
                <p className="text-orange-100 text-xs sm:text-sm">Powered by Perplexity AI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="text-white" size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' ? 'bg-orange-500' : 'bg-gray-100'
                }`}>
                  {message.type === 'user' ? (
                    <User className="text-white\" size={12} />
                  ) : (
                    <Bot className="text-gray-600" size={12} />
                  )}
                </div>
                
                <div className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
                  message.type === 'user' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="whitespace-pre-line text-sm sm:text-base">{message.content}</p>
                  
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs sm:text-sm transition-colors"
                        >
                          <Lightbulb className="inline mr-1 sm:mr-2" size={12} />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {(isAnalyzing || isTyping) && (
            <div className="flex justify-start">
              <div className="flex gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Bot className="text-gray-600" size={12} />
                </div>
                <div className="bg-gray-100 rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analisando com IA...
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-3 sm:p-4">
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && !isTyping && handleSendMessage(inputValue)}
              placeholder="Descreva o fluxo que você precisa..."
              disabled={isAnalyzing || isTyping}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isAnalyzing || isTyping}
              className="px-3 sm:px-4 py-2 sm:py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <Loader2 size={16} className="sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send size={16} className="sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};