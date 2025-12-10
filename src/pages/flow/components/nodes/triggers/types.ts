// Trigger Types
export type TriggerType =
  | 'TRIGGER_MESSAGE'
  | 'TRIGGER_WEBHOOK'
  | 'TRIGGER_SCHEDULE'
  | 'TRIGGER_EVENT';

// Base trigger data interface
export interface BaseTriggerData {
  label?: string;
  description?: string;
}

// Message Trigger Data
export interface MessageTriggerData extends BaseTriggerData {
  triggerType: 'any' | 'keyword';
  keywords?: string[];
  matchType?: 'exact' | 'contains' | 'regex' | 'starts_with';
  caseSensitive?: boolean;
}

// Webhook Trigger Data
export interface WebhookTriggerData extends BaseTriggerData {
  webhookUrl?: string;
  webhookId?: string;
  method: 'GET' | 'POST';
  authentication?: {
    type: 'none' | 'apiKey' | 'bearer';
    key?: string;
    headerName?: string;
  };
}

// Schedule Trigger Data
export interface ScheduleTriggerData extends BaseTriggerData {
  scheduleType: 'once' | 'recurring';
  cronExpression?: string;
  timezone: string;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}

// Event Trigger Data
export type EventType =
  | 'new_contact'
  | 'unanswered_message'
  | 'tag_added'
  | 'tag_removed'
  | 'contact_updated'
  | 'custom';

export interface EventTriggerData extends BaseTriggerData {
  eventType: EventType;
  filters?: {
    field: string;
    operator: 'equals' | 'contains' | 'not_equals' | 'greater_than' | 'less_than';
    value: string;
  }[];
}

// Union type for all trigger data
export type TriggerData =
  | MessageTriggerData
  | WebhookTriggerData
  | ScheduleTriggerData
  | EventTriggerData;

// Trigger node configuration
export interface TriggerConfig {
  type: TriggerType;
  label: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

// Trigger configurations
export const triggerConfigs: Record<TriggerType, TriggerConfig> = {
  TRIGGER_MESSAGE: {
    type: 'TRIGGER_MESSAGE',
    label: 'Mensagem WhatsApp',
    description: 'Inicia quando recebe mensagem',
    icon: 'MessageCircle',
    color: '#22c55e',
    bgColor: '#22c55e20',
  },
  TRIGGER_WEBHOOK: {
    type: 'TRIGGER_WEBHOOK',
    label: 'Webhook',
    description: 'Inicia por chamada HTTP',
    icon: 'Webhook',
    color: '#f97316',
    bgColor: '#f9731620',
  },
  TRIGGER_SCHEDULE: {
    type: 'TRIGGER_SCHEDULE',
    label: 'Agendamento',
    description: 'Inicia em horário programado',
    icon: 'Calendar',
    color: '#a855f7',
    bgColor: '#a855f720',
  },
  TRIGGER_EVENT: {
    type: 'TRIGGER_EVENT',
    label: 'Evento',
    description: 'Inicia por evento do sistema',
    icon: 'Zap',
    color: '#3b82f6',
    bgColor: '#3b82f620',
  },
};
