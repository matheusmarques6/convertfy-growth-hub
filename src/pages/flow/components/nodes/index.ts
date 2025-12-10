import { InitialNode } from './InitialNode';
import { SendMessageNode } from './SendMessageNode';
import { ConditionNode } from './ConditionNode';
import { DelayNode } from './DelayNode';
import { MakeRequestNode } from './MakeRequestNode';
import { AgentTransferNode } from './AgentTransferNode';
import { AITransferNode } from './AITransferNode';
import { ResponseSaverNode } from './ResponseSaverNode';
import type { NodeTypes } from '@xyflow/react';

// Import trigger nodes
import { triggerNodeTypes } from './triggers';

// Map node types to components
export const nodeTypes: NodeTypes = {
  // Legacy initial node (kept for backwards compatibility)
  INITIAL: InitialNode,

  // Trigger nodes
  ...triggerNodeTypes,

  // Action nodes
  SEND_MESSAGE: SendMessageNode,
  CONDITION: ConditionNode,
  DELAY: DelayNode,
  MAKE_REQUEST: MakeRequestNode,
  AGENT_TRANSFER: AgentTransferNode,
  ASSIGN_AGENT: AgentTransferNode,
  AI_TRANSFER: AITransferNode,
  RESPONSE_SAVER: ResponseSaverNode,

  // Fallback for legacy types
  DISABLE_AUTOREPLY: DelayNode,
  SPREADSHEET: MakeRequestNode,
  DATABASE_QUERY: MakeRequestNode,
};

// Re-export trigger types and configs
export * from './triggers/types';
export { triggerNodeTypes } from './triggers';

export {
  InitialNode,
  SendMessageNode,
  ConditionNode,
  DelayNode,
  MakeRequestNode,
  AgentTransferNode,
  AITransferNode,
  ResponseSaverNode,
};
