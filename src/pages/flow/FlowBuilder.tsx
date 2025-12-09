import { useCallback, useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from './components/nodes';
import { NodePanel } from './components/panels/NodePanel';
import { PropertiesPanel } from './components/panels/PropertiesPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { flowService } from '@/services/flows';
import { FlowNode, FlowEdge } from '@/types/api';
import {
  ArrowLeft,
  Save,
  Play,
  Settings,
  Loader2,
  Trash2,
} from 'lucide-react';

// Initial node for new flows
const initialNodes: Node[] = [
  {
    id: 'initialNode',
    type: 'INITIAL',
    position: { x: 100, y: 300 },
    data: {},
  },
];

const initialEdges: Edge[] = [];

function FlowBuilderInner() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowName, setFlowName] = useState('Untitled Flow');
  const [flowId, setFlowId] = useState(id === 'new' ? flowService.generateFlowId() : id || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(id !== 'new');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Load existing flow
  useEffect(() => {
    if (id && id !== 'new') {
      loadFlow(id);
    }
  }, [id]);

  const loadFlow = async (flowIdToLoad: string) => {
    try {
      setIsLoading(true);

      // Try to load from beta flows first
      const response = await flowService.getBetaFlows('wa_chatbot');
      if (response.success && response.data) {
        const flow = response.data.find((f) => f.flow_id === flowIdToLoad);
        if (flow) {
          setFlowName(flow.name);
          setFlowId(flow.flow_id);
          if (flow.data?.nodes) {
            setNodes(flow.data.nodes as Node[]);
          }
          if (flow.data?.edges) {
            setEdges(flow.data.edges as Edge[]);
          }
          return;
        }
      }

      // Fallback to legacy flow system
      const legacyResponse = await flowService.getFlowById(flowIdToLoad);
      if (legacyResponse.success) {
        if (legacyResponse.nodes) {
          setNodes(legacyResponse.nodes as unknown as Node[]);
        }
        if (legacyResponse.edges) {
          setEdges(legacyResponse.edges as unknown as Edge[]);
        }
      }
    } catch (error) {
      console.error('Error loading flow:', error);
      toast({
        title: 'Error',
        description: 'Failed to load flow',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const subType = event.dataTransfer.getData('application/reactflow/subtype');

      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: flowService.generateNodeId(),
        type,
        position,
        data: {
          moveToNextNode: true,
          type: subType ? { type: subType, title: subType } : undefined,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const onDragStart = (
    event: React.DragEvent,
    nodeType: string,
    subType?: string
  ) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    if (subType) {
      event.dataTransfer.setData('application/reactflow/subtype', subType);
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const flowData = {
        name: flowName,
        flow_id: flowId,
        source: 'wa_chatbot' as const,
        data: {
          nodes: nodes as unknown as FlowNode[],
          edges: edges as unknown as FlowEdge[],
        },
      };

      const response = await flowService.saveBetaFlow(flowData);

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Flow saved successfully',
        });

        // Update URL if it was a new flow
        if (id === 'new') {
          navigate(`/flow/${flowId}`, { replace: true });
        }
      } else {
        toast({
          title: 'Error',
          description: response.msg || 'Failed to save flow',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving flow:', error);
      toast({
        title: 'Error',
        description: 'Failed to save flow',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNode = useCallback(() => {
    if (selectedNode && selectedNode.id !== 'initialNode') {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter(
          (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
        )
      );
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Update node data when properties change
  const handleNodeUpdate = useCallback(
    (nodeId: string, newData: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: newData,
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Left Panel - Node Types */}
      <NodePanel onDragStart={onDragStart} />

      {/* Main Flow Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/chatbots')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Input
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="w-64 bg-gray-800 border-gray-700 text-white"
              placeholder="Flow name..."
            />
          </div>

          <div className="flex items-center gap-2">
            {selectedNode && selectedNode.id !== 'initialNode' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteNode}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Node
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Test
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Flow
            </Button>
          </div>
        </div>

        {/* Flow Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: '#3b82f6', strokeWidth: 2 },
            }}
          >
            <Controls className="!bg-gray-800 !border-gray-700 !rounded-lg" />
            <MiniMap
              className="!bg-gray-800 !border-gray-700 !rounded-lg"
              nodeColor={(node) => {
                switch (node.type) {
                  case 'INITIAL':
                    return '#22c55e';
                  case 'SEND_MESSAGE':
                    return '#3b82f6';
                  case 'CONDITION':
                    return '#eab308';
                  case 'DELAY':
                    return '#a855f7';
                  case 'MAKE_REQUEST':
                    return '#06b6d4';
                  case 'AGENT_TRANSFER':
                    return '#f97316';
                  case 'AI_TRANSFER':
                    return '#ec4899';
                  default:
                    return '#6b7280';
                }
              }}
            />
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="#374151"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Right Panel - Node Properties */}
      {selectedNode && (
        <PropertiesPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={handleNodeUpdate}
        />
      )}
    </div>
  );
}

export default function FlowBuilder() {
  return (
    <ReactFlowProvider>
      <FlowBuilderInner />
    </ReactFlowProvider>
  );
}
