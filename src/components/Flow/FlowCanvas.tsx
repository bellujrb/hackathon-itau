import React, { useCallback, useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  ReactFlowProvider,
  Node,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNode } from './CustomNode';
import { IntegrationNode } from './IntegrationNode';
import { SplitNode } from './SplitNode';
import { nodeTemplates } from '../../data/nodeTemplates';
import { NodeTemplate, FlowTemplate } from '../../types/flowTypes';

const nodeTypes = {
  custom: CustomNode,
  integration: IntegrationNode,
  split: SplitNode,
};

interface FlowCanvasProps {
  className?: string;
  onNodesChange?: (hasNodes: boolean) => void;
}

interface FlowCanvasRef {
  clearFlow: () => void;
  loadTemplate: (template: FlowTemplate) => void;
}

// Helper function to calculate distance between two points
const getDistance = (point1: { x: number; y: number }, point2: { x: number; y: number }) => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

// Helper function to find the closest node within connection range
const findClosestNode = (
  position: { x: number; y: number },
  nodes: Node[],
  maxDistance: number = 150
) => {
  let closestNode = null;
  let minDistance = maxDistance;

  nodes.forEach(node => {
    const nodeCenter = {
      x: node.position.x + 140, // Approximate node width / 2
      y: node.position.y + 80   // Approximate node height / 2
    };
    
    const distance = getDistance(position, nodeCenter);
    
    if (distance < minDistance) {
      minDistance = distance;
      closestNode = node;
    }
  });

  return closestNode;
};

export const FlowCanvas = forwardRef<FlowCanvasRef, FlowCanvasProps>(({ className, onNodesChange }, ref) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    clearFlow: () => {
      setNodes([]);
      setEdges([]);
    },
    loadTemplate: (template: FlowTemplate) => {
      setNodes(template.nodes);
      setEdges(template.edges.map(edge => ({
        ...edge,
        style: edge.style || { stroke: '#FF6B00', strokeWidth: 2 },
        labelStyle: edge.labelStyle || { fontSize: 12, fontWeight: 'bold' },
        markerEnd: { type: 'arrowclosed', color: edge.style?.stroke || '#FF6B00' }
      })));
    }
  }));

  // Global functions for node updates
  useEffect(() => {
    window.updateNodeData = (nodeId: string, newData: any) => {
      setNodes((nds) => 
        nds.map((node) => 
          node.id === nodeId ? { ...node, data: newData } : node
        )
      );
    };

    window.updateSplitEdges = (nodeId: string, splits: any[]) => {
      setEdges((eds) => {
        // Remove existing edges from this split node
        const filteredEdges = eds.filter(edge => edge.source !== nodeId);
        
        // Find connected target nodes
        const connectedEdges = eds.filter(edge => edge.source === nodeId);
        
        // Create new edges with updated percentages
        const newEdges = connectedEdges.map((edge, index) => {
          const split = splits.find(s => s.id === edge.sourceHandle) || splits[index];
          if (split) {
            return {
              ...edge,
              label: `${split.percentage}%`,
              style: { stroke: '#3B82F6', strokeWidth: 2 },
              labelStyle: { fontSize: 12, fontWeight: 'bold', fill: '#3B82F6' },
              labelBgStyle: { fill: 'white', fillOpacity: 0.8 },
              markerEnd: { type: 'arrowclosed', color: '#3B82F6' }
            };
          }
          return edge;
        });

        return [...filteredEdges, ...newEdges];
      });
    };

    return () => {
      delete window.updateNodeData;
      delete window.updateSplitEdges;
    };
  }, [setNodes, setEdges]);

  // Notify parent component when nodes change
  useEffect(() => {
    onNodesChange?.(nodes.length > 0);
  }, [nodes.length, onNodesChange]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      // Enhanced connection styling based on node type
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      let edgeStyle = { stroke: '#FF6B00', strokeWidth: 2 };
      let edgeLabel = '';
      let labelStyle = {};
      let labelBgStyle = {};
      
      // Special styling for split connections
      if (sourceNode?.type === 'split' && params.sourceHandle) {
        const splitData = sourceNode.data.config?.splits?.find((s: any) => s.id === params.sourceHandle);
        if (splitData) {
          edgeLabel = `${splitData.percentage}%`;
          edgeStyle = { stroke: '#3B82F6', strokeWidth: 2 };
          labelStyle = { fontSize: 12, fontWeight: 'bold', fill: '#3B82F6' };
          labelBgStyle = { fill: 'white', fillOpacity: 0.8 };
        }
      }
      
      setEdges((eds) => addEdge({
        ...params,
        style: edgeStyle,
        label: edgeLabel,
        labelStyle,
        labelBgStyle,
        markerEnd: { type: 'arrowclosed', color: edgeStyle.stroke }
      }, eds));
    },
    [setEdges, nodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const templateData = event.dataTransfer.getData('application/reactflow');

      if (typeof templateData === 'undefined' || !templateData || !reactFlowBounds) {
        return;
      }

      const template: NodeTemplate = JSON.parse(templateData);
      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      if (!position) return;

      const newNodeId = `${template.type}-${Date.now()}`;
      
      // Determine node type based on template
      let nodeType = 'custom';
      if (template.type === 'integration') {
        nodeType = 'integration';
      } else if (template.type === 'split') {
        nodeType = 'split';
      }

      const newNode: Node = {
        id: newNodeId,
        type: nodeType,
        position,
        data: {
          label: template.label,
          description: template.description,
          icon: template.icon,
          color: template.color,
          config: template.type === 'split' ? {
            splits: [
              { id: '1', percentage: 50, destination: 'Conta Principal', description: 'Recebimento principal' },
              { id: '2', percentage: 50, destination: 'Conta Secundária', description: 'Comissão/Taxa' }
            ]
          } : undefined
        },
      };

      // Find the closest existing node for auto-connection
      const closestNode = findClosestNode(position, nodes);
      
      setNodes((nds) => {
        const updatedNodes = nds.concat(newNode);
        
        // Auto-connect if there's a close node
        if (closestNode) {
          // Determine connection direction based on relative position
          const newNodeCenter = {
            x: position.x + 140,
            y: position.y + 80
          };
          const closestNodeCenter = {
            x: closestNode.position.x + 140,
            y: closestNode.position.y + 80
          };
          
          // If new node is below the closest node, connect from closest to new
          // If new node is above the closest node, connect from new to closest
          const isNewNodeBelow = newNodeCenter.y > closestNodeCenter.y;
          
          const newEdge: Edge = {
            id: `auto-${Date.now()}`,
            source: isNewNodeBelow ? closestNode.id : newNodeId,
            target: isNewNodeBelow ? newNodeId : closestNode.id,
            style: { stroke: '#FF6B00', strokeWidth: 2 },
            markerEnd: { type: 'arrowclosed', color: '#FF6B00' }
          };
          
          // Add the edge after a small delay to ensure the node is rendered
          setTimeout(() => {
            setEdges((eds) => {
              // Check if connection already exists to avoid duplicates
              const connectionExists = eds.some(edge => 
                (edge.source === newEdge.source && edge.target === newEdge.target) ||
                (edge.source === newEdge.target && edge.target === newEdge.source)
              );
              
              if (!connectionExists) {
                return [...eds, newEdge];
              }
              return eds;
            });
          }, 100);
        }
        
        return updatedNodes;
      });
    },
    [reactFlowInstance, setNodes, setEdges, nodes]
  );

  const onInit = (instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  };

  return (
    <div className={`flex-1 ${className}`} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeInternal}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        defaultEdgeOptions={{
          style: { stroke: '#FF6B00', strokeWidth: 2 },
          markerEnd: { type: 'arrowclosed', color: '#FF6B00' }
        }}
      >
        <Background color="#f8fafc" gap={24} size={1} />
        <Controls className="bg-white border border-gray-200 rounded-xl shadow-lg" />
        <MiniMap 
          className="bg-white border border-gray-200 rounded-xl shadow-sm"
          nodeColor={(node) => {
            if (node.type === 'split') return '#3B82F6';
            const template = nodeTemplates.find(t => t.type === node.type);
            return template?.color || '#6B7280';
          }}
          maskColor="rgba(255, 255, 255, 0.8)"
        />
      </ReactFlow>
    </div>
  );
});

FlowCanvas.displayName = 'FlowCanvas';

export const FlowCanvasWithProvider = forwardRef<FlowCanvasRef, FlowCanvasProps>((props, ref) => (
  <ReactFlowProvider>
    <FlowCanvas {...props} ref={ref} />
  </ReactFlowProvider>
));

FlowCanvasWithProvider.displayName = 'FlowCanvasWithProvider';