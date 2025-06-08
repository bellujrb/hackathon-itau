import { FlowTemplate } from '../types/flowTypes';

export const flowTemplates: FlowTemplate[] = [
  {
    id: 'basic-payment',
    name: 'Pagamento Básico',
    description: 'Fluxo simples de cobrança com notificação por email',
    category: 'Básico',
    thumbnail: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=400',
    complexity: 'Simples',
    estimatedTime: '5 min',
    tags: ['Cobrança', 'Email', 'Básico'],
    nodes: [
      {
        id: 'trigger-1',
        type: 'custom',
        position: { x: 250, y: 50 },
        data: {
          label: 'Acionador',
          description: 'Ativa o processo de checkout',
          icon: 'Play',
          color: '#4F46E5'
        }
      },
      {
        id: 'cobranca-1',
        type: 'custom',
        position: { x: 250, y: 200 },
        data: {
          label: 'Cobrança',
          description: 'Geração de invoice',
          icon: 'CreditCard',
          color: '#3B82F6'
        }
      },
      {
        id: 'email-1',
        type: 'custom',
        position: { x: 250, y: 350 },
        data: {
          label: 'E-mail',
          description: 'Envio de notificação por e-mail',
          icon: 'Mail',
          color: '#10B981'
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'trigger-1', target: 'cobranca-1' },
      { id: 'e2-3', source: 'cobranca-1', target: 'email-1' }
    ]
  },
  {
    id: 'split-payment',
    name: 'Split de Pagamento',
    description: 'Divisão automática de valores entre múltiplas contas',
    category: 'Intermediário',
    thumbnail: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400',
    complexity: 'Intermediário',
    estimatedTime: '15 min',
    tags: ['Split', 'Sub Account', 'Divisão'],
    nodes: [
      {
        id: 'trigger-1',
        type: 'custom',
        position: { x: 250, y: 50 },
        data: {
          label: 'Acionador',
          description: 'Ativa o processo de checkout',
          icon: 'Play',
          color: '#4F46E5'
        }
      },
      {
        id: 'split-1',
        type: 'split',
        position: { x: 250, y: 200 },
        data: {
          label: 'Split de pagamento',
          description: 'Split do valor da cobrança percentual',
          icon: 'GitBranch',
          color: '#3B82F6',
          config: {
            splits: [
              { id: '1', percentage: 85, destination: 'Conta Principal', description: 'Valor principal do produto/serviço' },
              { id: '2', percentage: 15, destination: 'Conta Comissão', description: 'Taxa de comissão da plataforma' }
            ]
          }
        }
      },
      {
        id: 'subaccount-1',
        type: 'custom',
        position: { x: 150, y: 380 },
        data: {
          label: 'Sub Account',
          description: 'Conta principal de recebimento',
          icon: 'Building2',
          color: '#FF6B00'
        }
      },
      {
        id: 'subaccount-2',
        type: 'custom',
        position: { x: 350, y: 380 },
        data: {
          label: 'Sub Account',
          description: 'Conta de comissão',
          icon: 'Building2',
          color: '#FF6B00'
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'trigger-1', target: 'split-1' },
      { 
        id: 'e2-3', 
        source: 'split-1', 
        sourceHandle: '1',
        target: 'subaccount-1',
        label: '85%',
        style: { stroke: '#3B82F6', strokeWidth: 2 },
        labelStyle: { fontSize: 12, fontWeight: 'bold', fill: '#3B82F6' }
      },
      { 
        id: 'e2-4', 
        source: 'split-1', 
        sourceHandle: '2',
        target: 'subaccount-2',
        label: '15%',
        style: { stroke: '#3B82F6', strokeWidth: 2 },
        labelStyle: { fontSize: 12, fontWeight: 'bold', fill: '#3B82F6' }
      }
    ]
  },
  {
    id: 'enterprise-flow',
    name: 'Fluxo Empresarial Completo',
    description: 'Fluxo avançado com integração ERP, aprovação e conciliação',
    category: 'Avançado',
    thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    complexity: 'Avançado',
    estimatedTime: '30 min',
    tags: ['ERP', 'Aprovação', 'Integração', 'Conciliação'],
    nodes: [
      {
        id: 'trigger-1',
        type: 'custom',
        position: { x: 250, y: 50 },
        data: {
          label: 'Acionador',
          description: 'Ativa o processo de checkout',
          icon: 'Play',
          color: '#4F46E5'
        }
      },
      {
        id: 'approval-1',
        type: 'custom',
        position: { x: 250, y: 200 },
        data: {
          label: 'Aprovação',
          description: 'Solicita aprovação manual do processo',
          icon: 'CheckCircle',
          color: '#EF4444'
        }
      },
      {
        id: 'integration-1',
        type: 'integration',
        position: { x: 250, y: 350 },
        data: {
          label: 'Integração',
          description: 'Integração para consulta financeira',
          icon: 'Link2',
          color: '#8B5CF6'
        }
      },
      {
        id: 'cobranca-1',
        type: 'custom',
        position: { x: 250, y: 500 },
        data: {
          label: 'Cobrança',
          description: 'Geração de invoice',
          icon: 'CreditCard',
          color: '#3B82F6'
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'trigger-1', target: 'approval-1' },
      { id: 'e2-3', source: 'approval-1', target: 'integration-1' },
      { id: 'e3-4', source: 'integration-1', target: 'cobranca-1' }
    ]
  }
];