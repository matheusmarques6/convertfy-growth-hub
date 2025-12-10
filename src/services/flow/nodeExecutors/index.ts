import { NodeExecutorRegistry } from './types';
import { makeRequestExecutor } from './makeRequestExecutor';
import { sendMessageExecutor } from './sendMessageExecutor';
import { conditionExecutor } from './conditionExecutor';
import { delayExecutor } from './delayExecutor';
import { aiTransferExecutor } from './aiTransferExecutor';

// Export individual executors
export { makeRequestExecutor } from './makeRequestExecutor';
export { sendMessageExecutor } from './sendMessageExecutor';
export { conditionExecutor } from './conditionExecutor';
export { delayExecutor } from './delayExecutor';
export { aiTransferExecutor } from './aiTransferExecutor';

// Export types
export * from './types';

// Registry of all node executors
export const nodeExecutors: NodeExecutorRegistry = {
  // Action nodes
  MAKE_REQUEST: makeRequestExecutor,
  ACTION_MAKE_REQUEST: makeRequestExecutor,

  // Message nodes
  SEND_MESSAGE: sendMessageExecutor,
  ACTION_SEND_MESSAGE: sendMessageExecutor,

  // Condition nodes
  CONDITION: conditionExecutor,
  LOGIC_CONDITION: conditionExecutor,

  // Delay nodes
  DELAY: delayExecutor,
  ACTION_DELAY: delayExecutor,

  // AI nodes
  AI_TRANSFER: aiTransferExecutor,
  ACTION_AI_TRANSFER: aiTransferExecutor,

  // Trigger nodes (passthrough - just start the flow)
  TRIGGER_MESSAGE: async () => ({ success: true, output: {} }),
  TRIGGER_WEBHOOK: async () => ({ success: true, output: {} }),
  TRIGGER_SCHEDULE: async () => ({ success: true, output: {} }),
  TRIGGER_EVENT: async () => ({ success: true, output: {} }),
  INITIAL: async () => ({ success: true, output: {} }),
};

// Get executor for a node type
export function getNodeExecutor(nodeType: string) {
  return nodeExecutors[nodeType] || null;
}

// Check if a node type has an executor
export function hasExecutor(nodeType: string): boolean {
  return nodeType in nodeExecutors;
}
