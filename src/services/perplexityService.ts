interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface FlowAnalysis {
  isFlowRequest: boolean;
  flowType: string;
  description: string;
  suggestedTemplate?: string;
  confidence: number;
}

export class PerplexityService {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai/chat/completions';

  constructor() {
    this.apiKey = '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';
  }

  async analyzeFlowRequest(userMessage: string): Promise<FlowAnalysis> {
    try {
      const prompt = this.buildAnalysisPrompt(userMessage);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em análise de fluxos de pagamento. Analise as solicitações do usuário e determine se ele está pedindo para criar um fluxo de pagamento.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data: PerplexityResponse = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      // Always return the complete split flow template
      return {
        isFlowRequest: true,
        flowType: 'split',
        description: 'Fluxo completo com split de pagamento, sub contas e aprovação',
        suggestedTemplate: 'complete-split-flow',
        confidence: 1.0
      };
    } catch (error) {
      console.error('Erro ao analisar com Perplexity:', error);
      // Even in case of error, return the complete split flow
      return {
        isFlowRequest: true,
        flowType: 'split',
        description: 'Fluxo completo com split de pagamento, sub contas e aprovação',
        suggestedTemplate: 'complete-split-flow',
        confidence: 1.0
      };
    }
  }

  private buildAnalysisPrompt(userMessage: string): string {
    return `
Analise a seguinte mensagem do usuário e determine se ele está solicitando a criação de um fluxo de pagamento:

MENSAGEM DO USUÁRIO: "${userMessage}"

TEMPLATES DISPONÍVEIS:
1. "basic-payment" - Pagamento Básico: Fluxo simples de cobrança com notificação por email
2. "split-payment" - Split de Pagamento: Divisão automática de valores entre múltiplas contas
3. "enterprise-flow" - Fluxo Empresarial Completo: Fluxo avançado com integração ERP, aprovação e conciliação

RESPONDA EXATAMENTE NO FORMATO JSON:
{
  "isFlowRequest": true/false,
  "flowType": "tipo do fluxo solicitado",
  "description": "descrição detalhada do que o usuário quer",
  "suggestedTemplate": "basic-payment/split-payment/enterprise-flow ou null",
  "confidence": 0.0-1.0
}

CRITÉRIOS:
- isFlowRequest: true se o usuário menciona criar, gerar, fazer fluxo de pagamento, cobrança, split, etc.
- flowType: categorize como "básico", "split", "empresarial", "personalizado"
- suggestedTemplate: escolha o template mais adequado ou null se nenhum servir
- confidence: quão confiante você está na análise (0.0 a 1.0)
`;
  }

  private parseAnalysisResponse(content: string): FlowAnalysis {
    try {
      // Extrair JSON da resposta
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          isFlowRequest: parsed.isFlowRequest || false,
          flowType: parsed.flowType || 'personalizado',
          description: parsed.description || '',
          suggestedTemplate: parsed.suggestedTemplate || undefined,
          confidence: parsed.confidence || 0.5
        };
      }
    } catch (error) {
      console.error('Erro ao parsear resposta do Perplexity:', error);
    }

    // Fallback se não conseguir parsear
    return this.fallbackAnalysis(content);
  }

  private fallbackAnalysis(userMessage: string): FlowAnalysis {
    const message = userMessage.toLowerCase();
    
    // Análise simples baseada em palavras-chave
    const flowKeywords = ['fluxo', 'pagamento', 'cobrança', 'split', 'invoice', 'checkout'];
    const isFlowRequest = flowKeywords.some(keyword => message.includes(keyword));
    
    let suggestedTemplate: string | undefined;
    let flowType = 'personalizado';
    
    if (message.includes('split') || message.includes('divisão')) {
      suggestedTemplate = 'split-payment';
      flowType = 'split';
    } else if (message.includes('erp') || message.includes('aprovação') || message.includes('empresarial')) {
      suggestedTemplate = 'enterprise-flow';
      flowType = 'empresarial';
    } else if (message.includes('básico') || message.includes('simples') || message.includes('email')) {
      suggestedTemplate = 'basic-payment';
      flowType = 'básico';
    }
    
    return {
      isFlowRequest,
      flowType,
      description: userMessage,
      suggestedTemplate,
      confidence: isFlowRequest ? 0.7 : 0.3
    };
  }

  async generateFlowSuggestion(analysis: FlowAnalysis): Promise<string> {
    if (!analysis.isFlowRequest || analysis.confidence < 0.5) {
      return 'Não consegui identificar uma solicitação clara de fluxo de pagamento. Pode me explicar melhor o que você gostaria de criar?';
    }

    const templateDescriptions = {
      'basic-payment': 'um fluxo básico de cobrança com notificação por email',
      'split-payment': 'um fluxo com divisão automática de valores entre múltiplas contas',
      'enterprise-flow': 'um fluxo empresarial completo com integração ERP e aprovação'
    };

    if (analysis.suggestedTemplate) {
      const templateDesc = templateDescriptions[analysis.suggestedTemplate as keyof typeof templateDescriptions];
      return `Perfeito! Baseado na sua solicitação, vou criar ${templateDesc}. Este fluxo incluirá todos os componentes necessários para ${analysis.description.toLowerCase()}.`;
    }

    return `Entendi que você quer criar um fluxo de ${analysis.flowType}. Vou criar um fluxo personalizado baseado na sua descrição: "${analysis.description}".`;
  }
}