export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    description: string;
    icon: string;
    color: string;
    config?: Record<string, any>;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  label?: string;
  style?: Record<string, any>;
  labelStyle?: Record<string, any>;
  labelBgStyle?: Record<string, any>;
}

export interface NodeTemplate {
  type: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  category: 'trigger' | 'payment' | 'integration' | 'notification' | 'control';
}

export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  tags: string[];
  complexity: 'Simples' | 'Intermediário' | 'Avançado';
  estimatedTime: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export interface SplitConfig {
  id: string;
  percentage: number;
  destination: string;
  description: string;
}