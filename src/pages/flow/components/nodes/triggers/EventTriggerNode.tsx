import { Handle, Position } from '@xyflow/react';
import { Zap, UserPlus, Clock, Tag, RefreshCw } from 'lucide-react';
import { triggerConfigs, EventTriggerData, EventType } from './types';

interface EventTriggerNodeProps {
  data: EventTriggerData;
  selected?: boolean;
}

const eventLabels: Record<EventType, { label: string; icon: React.ReactNode; color: string }> = {
  new_contact: {
    label: 'Novo Contato',
    icon: <UserPlus className="w-3.5 h-3.5" />,
    color: 'text-green-400',
  },
  unanswered_message: {
    label: 'Mensagem sem Resposta',
    icon: <Clock className="w-3.5 h-3.5" />,
    color: 'text-yellow-400',
  },
  tag_added: {
    label: 'Tag Adicionada',
    icon: <Tag className="w-3.5 h-3.5" />,
    color: 'text-blue-400',
  },
  tag_removed: {
    label: 'Tag Removida',
    icon: <Tag className="w-3.5 h-3.5" />,
    color: 'text-red-400',
  },
  contact_updated: {
    label: 'Contato Atualizado',
    icon: <RefreshCw className="w-3.5 h-3.5" />,
    color: 'text-purple-400',
  },
  custom: {
    label: 'Evento Customizado',
    icon: <Zap className="w-3.5 h-3.5" />,
    color: 'text-orange-400',
  },
};

export function EventTriggerNode({ data, selected }: EventTriggerNodeProps) {
  const config = triggerConfigs.TRIGGER_EVENT;

  const eventType = data?.eventType || 'new_contact';
  const filters = data?.filters || [];

  const eventConfig = eventLabels[eventType];

  const renderPreview = () => {
    return (
      <div className="space-y-2">
        <div className={`flex items-center gap-2 text-xs ${eventConfig.color}`}>
          {eventConfig.icon}
          <span className="text-white">{eventConfig.label}</span>
        </div>

        {filters.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs text-gray-500">Filtros:</div>
            {filters.slice(0, 2).map((filter, index) => (
              <div
                key={index}
                className="text-xs text-gray-400 bg-black/20 px-2 py-1 rounded truncate"
              >
                {filter.field} {filter.operator} "{filter.value}"
              </div>
            ))}
            {filters.length > 2 && (
              <div className="text-xs text-gray-500">
                +{filters.length - 2} filtros
              </div>
            )}
          </div>
        )}

        {filters.length === 0 && (
          <div className="text-xs text-gray-500">
            Sem filtros (todos os eventos)
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
        min-w-[240px] rounded-2xl border-2 overflow-hidden
        transition-all duration-200
        ${selected ? 'shadow-lg ring-2 ring-offset-2 ring-offset-gray-950' : ''}
      `}
      style={{
        borderColor: selected ? config.color : `${config.color}80`,
        backgroundColor: config.bgColor,
        boxShadow: selected ? `0 0 20px ${config.color}40` : undefined,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-2.5 flex items-center gap-2"
        style={{ backgroundColor: config.color }}
      >
        <Zap className="w-4 h-4 text-white" />
        <span className="text-sm font-semibold text-white">Gatilho</span>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl"
            style={{ backgroundColor: `${config.color}30` }}
          >
            <Zap className="w-5 h-5" style={{ color: config.color }} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">{config.label}</div>
            <div className="text-xs text-gray-400">{config.description}</div>
          </div>
        </div>

        {/* Preview section */}
        <div className="mt-3 pt-3 border-t border-white/10">
          {renderPreview()}
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="trigger-out"
        className="!w-4 !h-4 !border-2 !border-white"
        style={{ backgroundColor: config.color, right: -8 }}
      />
    </div>
  );
}
