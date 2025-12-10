import { FlowNode, FlowEdge } from '@/types/api';

const STORAGE_KEY = 'convertfy_flows';

export interface StoredFlow {
  id: number;
  flow_id: string;
  name: string;
  source: 'wa_chatbot' | 'webhook_flow';
  is_active: boolean;
  tags?: string[];
  data: {
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
  stats?: {
    executions: number;
    failures: number;
    avgRunTime: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Generate unique ID
const generateId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Generate flow ID
const generateFlowId = (): string => {
  return `flow_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

// Get all flows from localStorage
const getAllFlows = (): StoredFlow[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading flows from localStorage:', error);
  }
  return [];
};

// Save all flows to localStorage
const saveAllFlows = (flows: StoredFlow[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flows));
  } catch (error) {
    console.error('Error saving flows to localStorage:', error);
  }
};

// Get a single flow by flow_id
const getFlowById = (flowId: string): StoredFlow | null => {
  const flows = getAllFlows();
  return flows.find((f) => f.flow_id === flowId) || null;
};

// Create a new flow
const createFlow = (data: {
  name: string;
  flow_id?: string;
  source?: 'wa_chatbot' | 'webhook_flow';
  tags?: string[];
  nodes: FlowNode[];
  edges: FlowEdge[];
}): StoredFlow => {
  const flows = getAllFlows();
  const now = new Date().toISOString();

  const newFlow: StoredFlow = {
    id: generateId(),
    flow_id: data.flow_id || generateFlowId(),
    name: data.name,
    source: data.source || 'wa_chatbot',
    is_active: false,
    tags: data.tags || [],
    data: {
      nodes: data.nodes,
      edges: data.edges,
    },
    stats: {
      executions: 0,
      failures: 0,
      avgRunTime: 0,
    },
    createdAt: now,
    updatedAt: now,
  };

  flows.push(newFlow);
  saveAllFlows(flows);
  return newFlow;
};

// Update an existing flow
const updateFlow = (
  flowId: string,
  updates: Partial<Omit<StoredFlow, 'id' | 'flow_id' | 'createdAt'>>
): StoredFlow | null => {
  const flows = getAllFlows();
  const index = flows.findIndex((f) => f.flow_id === flowId);

  if (index === -1) return null;

  flows[index] = {
    ...flows[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveAllFlows(flows);
  return flows[index];
};

// Save or update flow (upsert)
const saveFlow = (data: {
  name: string;
  flow_id: string;
  source?: 'wa_chatbot' | 'webhook_flow';
  tags?: string[];
  data: {
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
}): StoredFlow => {
  const existing = getFlowById(data.flow_id);

  if (existing) {
    return updateFlow(data.flow_id, {
      name: data.name,
      source: data.source,
      tags: data.tags,
      data: data.data,
    }) as StoredFlow;
  }

  return createFlow({
    name: data.name,
    flow_id: data.flow_id,
    source: data.source,
    tags: data.tags,
    nodes: data.data.nodes,
    edges: data.data.edges,
  });
};

// Delete a flow
const deleteFlow = (flowId: string): boolean => {
  const flows = getAllFlows();
  const newFlows = flows.filter((f) => f.flow_id !== flowId);

  if (newFlows.length === flows.length) return false;

  saveAllFlows(newFlows);
  return true;
};

// Duplicate a flow
const duplicateFlow = (flowId: string): StoredFlow | null => {
  const original = getFlowById(flowId);
  if (!original) return null;

  return createFlow({
    name: `${original.name} (copy)`,
    source: original.source,
    tags: original.tags,
    nodes: JSON.parse(JSON.stringify(original.data.nodes)),
    edges: JSON.parse(JSON.stringify(original.data.edges)),
  });
};

// Add sample flows for demo purposes
const addSampleFlows = (): void => {
  const flows = getAllFlows();
  if (flows.length > 0) return; // Don't add if flows already exist

  const sampleFlows: Omit<StoredFlow, 'id'>[] = [
    {
      flow_id: 'flow_sample_1',
      name: 'SDR GilsonCar',
      source: 'wa_chatbot',
      is_active: true,
      tags: ['GilsonCar', 'Criativvo', 'WhatsApp IA'],
      data: { nodes: [], edges: [] },
      stats: { executions: 1250, failures: 12, avgRunTime: 8.5 },
      createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      flow_id: 'flow_sample_2',
      name: 'AVISA NO GRUPO JK Imports',
      source: 'wa_chatbot',
      is_active: false,
      tags: ['nao finalizado', 'JK Imports'],
      data: { nodes: [], edges: [] },
      stats: { executions: 320, failures: 8, avgRunTime: 5.2 },
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      flow_id: 'flow_sample_3',
      name: 'AVISA NO GRUPO BENETÃO',
      source: 'wa_chatbot',
      is_active: false,
      tags: ['nao finalizado', 'Benetão'],
      data: { nodes: [], edges: [] },
      stats: { executions: 180, failures: 3, avgRunTime: 4.8 },
      createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      flow_id: 'flow_sample_4',
      name: 'Salvar Contatos JK IMPORTS',
      source: 'wa_chatbot',
      is_active: false,
      tags: ['Banco de Dados', 'Criativvo', 'JK Imports'],
      data: { nodes: [], edges: [] },
      stats: { executions: 890, failures: 25, avgRunTime: 12.3 },
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      flow_id: 'flow_sample_5',
      name: 'SDR JK Imports',
      source: 'wa_chatbot',
      is_active: false,
      tags: ['Criativvo', 'WhatsApp IA', 'JK Imports'],
      data: { nodes: [], edges: [] },
      stats: { executions: 533, failures: 30, avgRunTime: 11.23 },
      createdAt: new Date(Date.now() - 86400000 * 67).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      flow_id: 'flow_sample_6',
      name: 'SDR Bea Enxovais',
      source: 'wa_chatbot',
      is_active: false,
      tags: ['Bea Enxovais', 'Criativvo', 'WhatsApp IA'],
      data: { nodes: [], edges: [] },
      stats: { executions: 420, failures: 15, avgRunTime: 9.8 },
      createdAt: new Date(Date.now() - 86400000 * 47).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      flow_id: 'flow_sample_7',
      name: 'SDR Mari',
      source: 'wa_chatbot',
      is_active: true,
      tags: ['Lefitsaladas', 'Criativvo', 'WhatsApp IA'],
      data: { nodes: [], edges: [] },
      stats: { executions: 280, failures: 5, avgRunTime: 7.5 },
      createdAt: new Date(Date.now() - 86400000 * 29).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
  ];

  const flowsWithIds = sampleFlows.map((f) => ({
    ...f,
    id: generateId(),
  }));

  saveAllFlows(flowsWithIds);
};

// Initialize with sample data
addSampleFlows();

export const flowStorageService = {
  getAllFlows,
  getFlowById,
  createFlow,
  updateFlow,
  saveFlow,
  deleteFlow,
  duplicateFlow,
  generateFlowId,
  addSampleFlows,
};
