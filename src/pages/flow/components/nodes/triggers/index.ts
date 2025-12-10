// Trigger Node Components
import { MessageTriggerNode } from './MessageTriggerNode';
import { WebhookTriggerNode } from './WebhookTriggerNode';
import { ScheduleTriggerNode } from './ScheduleTriggerNode';
import { EventTriggerNode } from './EventTriggerNode';

// Re-export components
export { MessageTriggerNode, WebhookTriggerNode, ScheduleTriggerNode, EventTriggerNode };

// Types
export * from './types';

// Node types map for React Flow
export const triggerNodeTypes = {
  TRIGGER_MESSAGE: MessageTriggerNode,
  TRIGGER_WEBHOOK: WebhookTriggerNode,
  TRIGGER_SCHEDULE: ScheduleTriggerNode,
  TRIGGER_EVENT: EventTriggerNode,
};
