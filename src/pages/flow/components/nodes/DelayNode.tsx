import { Handle, Position, NodeProps } from '@xyflow/react';
import { Clock } from 'lucide-react';
import { FlowNodeData } from '@/types/api';

interface DelayNodeProps extends NodeProps {
  data: FlowNodeData;
}

export function DelayNode({ data, selected }: DelayNodeProps) {
  const getDelayText = () => {
    if (data.seconds) return `${data.seconds} seconds`;
    if (data.duration && data.timeUnit) {
      return `${data.duration} ${data.timeUnit}`;
    }
    return 'Configure delay...';
  };

  return (
    <div
      className={`
        px-4 py-3 rounded-xl border-2 min-w-[200px]
        bg-gradient-to-br from-purple-500/20 to-purple-600/10
        ${selected ? 'border-purple-400 shadow-lg shadow-purple-500/20' : 'border-purple-500/50'}
        transition-all duration-200
      `}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-purple-300"
      />

      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-500">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Delay</div>
          <div className="text-xs text-gray-400">{getDelayText()}</div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-purple-300"
      />
    </div>
  );
}
