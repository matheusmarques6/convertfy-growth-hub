import { Handle, Position } from '@xyflow/react';
import { Webhook, Copy, CheckCircle, Zap } from 'lucide-react';
import { useState } from 'react';
import { triggerConfigs, WebhookTriggerData } from './types';

interface WebhookTriggerNodeProps {
  data: WebhookTriggerData;
  selected?: boolean;
}

export function WebhookTriggerNode({ data, selected }: WebhookTriggerNodeProps) {
  const config = triggerConfigs.TRIGGER_WEBHOOK;
  const [copied, setCopied] = useState(false);

  const webhookUrl = data?.webhookUrl || '';
  const method = data?.method || 'POST';

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderPreview = () => {
    if (!webhookUrl) {
      return (
        <div className="flex items-center gap-2 text-xs text-yellow-400">
          <Webhook className="w-3.5 h-3.5" />
          <span>Salve para gerar URL do webhook</span>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 text-xs font-mono rounded bg-orange-500/20 text-orange-300">
            {method}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-green-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copiar URL</span>
              </>
            )}
          </button>
        </div>
        <div className="text-xs text-gray-400 font-mono truncate bg-black/20 px-2 py-1 rounded">
          {webhookUrl.length > 35 ? `${webhookUrl.slice(0, 35)}...` : webhookUrl}
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
            <Webhook className="w-5 h-5" style={{ color: config.color }} />
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
