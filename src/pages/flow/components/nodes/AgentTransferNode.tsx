import { Handle, Position, NodeProps } from '@xyflow/react';
import { UserCheck } from 'lucide-react';
import { FlowNodeData } from '@/types/api';

interface AgentTransferNodeProps extends NodeProps {
  data: FlowNodeData;
}

export function AgentTransferNode({ data, selected }: AgentTransferNodeProps) {
  const agentName = data.agentData?.name || 'Any available agent';
  const autoSelect = data.autoAgentSelect;

  return (
    <div
      className={`
        px-4 py-3 rounded-xl border-2 min-w-[220px]
        bg-gradient-to-br from-orange-500/20 to-orange-600/10
        ${selected ? 'border-orange-400 shadow-lg shadow-orange-500/20' : 'border-orange-500/50'}
        transition-all duration-200
      `}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-orange-300"
      />

      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-500">
          <UserCheck className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Transfer to Agent</div>
          <div className="text-xs text-gray-400">
            {autoSelect ? 'Auto-select agent' : agentName}
          </div>
        </div>
      </div>

      {/* Duration indicator */}
      {data.duration && data.timeUnit && (
        <div className="mt-2 text-xs text-orange-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          Timeout: {data.duration} {data.timeUnit}
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-orange-300"
      />
    </div>
  );
}
