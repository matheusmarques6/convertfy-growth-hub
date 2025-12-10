import { Handle, Position } from '@xyflow/react';
import { MessageCircle, Hash, MessageSquareText, Zap } from 'lucide-react';
import { triggerConfigs, MessageTriggerData } from './types';

interface MessageTriggerNodeProps {
  data: MessageTriggerData;
  selected?: boolean;
}

export function MessageTriggerNode({ data, selected }: MessageTriggerNodeProps) {
  const config = triggerConfigs.TRIGGER_MESSAGE;

  const triggerType = (data as MessageTriggerData)?.triggerType || 'any';
  const keywords = (data as MessageTriggerData)?.keywords || [];
  const matchType = (data as MessageTriggerData)?.matchType || 'contains';

  // Generate preview based on configuration
  const renderPreview = () => {
    if (triggerType === 'any') {
      return (
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <MessageSquareText className="w-3.5 h-3.5 text-green-400" />
          <span>Qualquer mensagem inicia o flow</span>
        </div>
      );
    }

    if (keywords.length === 0) {
      return (
        <div className="flex items-center gap-2 text-xs text-yellow-400">
          <Hash className="w-3.5 h-3.5" />
          <span>Configure as palavras-chave</span>
        </div>
      );
    }

    const matchLabels: Record<string, string> = {
      exact: 'Igual a',
      contains: 'Contém',
      starts_with: 'Começa com',
      regex: 'Regex',
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Hash className="w-3.5 h-3.5 text-green-400" />
          <span>{matchLabels[matchType]}:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {keywords.slice(0, 3).map((keyword: string, index: number) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-300 border border-green-500/30"
            >
              {keyword}
            </span>
          ))}
          {keywords.length > 3 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">
              +{keywords.length - 3}
            </span>
          )}
        </div>
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
            <MessageCircle className="w-5 h-5" style={{ color: config.color }} />
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
