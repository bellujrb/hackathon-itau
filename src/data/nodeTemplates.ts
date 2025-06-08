import { NodeTemplate } from '../types/flowTypes';

export const nodeTemplates: NodeTemplate[] = [
  {
    type: 'trigger',
    label: 'Acionador',
    description: 'Ativa o processo de checkout',
    icon: 'Play',
    color: '#4F46E5',
    category: 'trigger'
  },
  {
    type: 'cobranca',
    label: 'Cobrança',
    description: 'Geração de invoice',
    icon: 'CreditCard',
    color: '#3B82F6',
    category: 'payment'
  },
  {
    type: 'split',
    label: 'Split de pagamento',
    description: 'Divisão percentual de valores entre contas',
    icon: 'GitBranch',
    color: '#3B82F6',
    category: 'payment'
  },
  {
    type: 'subaccount',
    label: 'Sub Account',
    description: 'Definição da conta de recebimento',
    icon: 'Building2',
    color: '#FF6B00',
    category: 'payment'
  },
  {
    type: 'integration',
    label: 'Integração',
    description: 'Integração para consulta financeira',
    icon: 'Link2',
    color: '#8B5CF6',
    category: 'integration'
  },
  {
    type: 'approval',
    label: 'Aprovação',
    description: 'Solicita aprovação manual do processo',
    icon: 'CheckCircle',
    color: '#EF4444',
    category: 'control'
  },
  {
    type: 'email',
    label: 'E-mail',
    description: 'Envio de notificação por e-mail',
    icon: 'Mail',
    color: '#10B981',
    category: 'notification'
  },
  {
    type: 'pix-ted',
    label: 'PIX ou TED',
    description: 'Processamento de transferência PIX ou TED',
    icon: 'Banknote',
    color: '#F59E0B',
    category: 'payment'
  },
  {
    type: 'end',
    label: 'Fim do processo',
    description: 'Finalização do fluxo de pagamento',
    icon: 'Square',
    color: '#6B7280',
    category: 'control'
  }
];