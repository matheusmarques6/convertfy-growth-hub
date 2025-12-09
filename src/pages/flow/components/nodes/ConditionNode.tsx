import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch } from 'lucide-react';
import { FlowNodeData } from '@/types/api';

interface ConditionNodeProps extends NodeProps {
  data: FlowNodeData;
}

export function ConditionNode({ data, selected }: ConditionNodeProps) {
  const conditions = data.conditions || [];

  return (
    <div
      className={`
        px-4 py-3 rounded-xl border-2 min-w-[250px]
        bg-gradient-to-br from-yellow-500/20 to-orange-500/10
        ${selected ? 'border-yellow-400 shadow-lg shadow-yellow-500/20' : 'border-yellow-500/50'}
        transition-all duration-200
      `}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-yellow-500 !border-2 !border-yellow-300"
      />

      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-yellow-500 flex-shrink-0">
          <GitBranch className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white">Condition</div>
          <div className="text-xs text-gray-400 mb-2">
            {conditions.length} condition{conditions.length !== 1 ? 's' : ''}
          </div>

          {/* Conditions list */}
          <div className="space-y-1">
            {conditions.slice(0, 3).map((cond, idx) => (
              <div
                key={idx}
                className="text-xs bg-black/20 rounded px-2 py-1 text-gray-300 truncate"
              >
                {cond.name || `Condition ${idx + 1}`}
              </div>
            ))}
            {conditions.length > 3 && (
              <div className="text-xs text-yellow-400">
                +{conditions.length - 3} more
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Output Handles for each condition */}
      {conditions.map((cond, idx) => (
        <Handle
          key={idx}
          type="source"
          position={Position.Right}
          id={`condition-${idx}`}
          className="!w-3 !h-3 !bg-yellow-500 !border-2 !border-yellow-300"
          style={{ top: `${30 + idx * 25}%` }}
        />
      ))}

      {/* Default output (else) */}
      <Handle
        type="source"
        position={Position.Right}
        id="else"
        className="!w-3 !h-3 !bg-gray-500 !border-2 !border-gray-300"
        style={{ top: '85%' }}
      />
    </div>
  );
}
