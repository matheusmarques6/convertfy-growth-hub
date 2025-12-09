import { Handle, Position, NodeProps } from '@xyflow/react';
import { Bot } from 'lucide-react';
import { FlowNodeData } from '@/types/api';

interface AITransferNodeProps extends NodeProps {
  data: FlowNodeData;
}

export function AITransferNode({ data, selected }: AITransferNodeProps) {
  const provider = data.provider?.id || 'OpenAI';
  const model = data.provider?.model?.name || 'GPT-4';

  return (
    <div
      className={`
        px-4 py-3 rounded-xl border-2 min-w-[220px]
        bg-gradient-to-br from-pink-500/20 to-pink-600/10
        ${selected ? 'border-pink-400 shadow-lg shadow-pink-500/20' : 'border-pink-500/50'}
        transition-all duration-200
      `}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-pink-500 !border-2 !border-pink-300"
      />

      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-pink-500">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">AI Assistant</div>
          <div className="text-xs text-gray-400">{provider} - {model}</div>
        </div>
      </div>

      {/* AI Task indicator */}
      {data.aiTask?.active && (
        <div className="mt-2 text-xs text-pink-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
          {data.aiTask.functions?.length || 0} function{(data.aiTask.functions?.length || 0) !== 1 ? 's' : ''} enabled
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-pink-500 !border-2 !border-pink-300"
      />
    </div>
  );
}
