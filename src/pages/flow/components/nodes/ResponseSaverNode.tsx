import { Handle, Position } from '@xyflow/react';
import { Save } from 'lucide-react';
import { FlowNodeData } from '@/types/api';

interface ResponseSaverNodeProps {
  data: FlowNodeData;
  selected?: boolean;
}

export function ResponseSaverNode({ data, selected }: ResponseSaverNodeProps) {
  const variables = data.variables || [];

  return (
    <div
      className={`
        px-4 py-3 rounded-xl border-2 min-w-[220px]
        bg-gradient-to-br from-emerald-500/20 to-emerald-600/10
        ${selected ? 'border-emerald-400 shadow-lg shadow-emerald-500/20' : 'border-emerald-500/50'}
        transition-all duration-200
      `}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-emerald-300"
      />

      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-emerald-500 flex-shrink-0">
          <Save className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white">Save Response</div>
          <div className="text-xs text-gray-400 mb-2">
            {variables.length} variable{variables.length !== 1 ? 's' : ''}
          </div>

          {/* Variables list */}
          <div className="space-y-1">
            {variables.slice(0, 3).map((v, idx) => (
              <div
                key={idx}
                className="text-xs bg-black/20 rounded px-2 py-1 text-emerald-300 font-mono"
              >
                {`{{{${v.varName}}}}`}
              </div>
            ))}
            {variables.length > 3 && (
              <div className="text-xs text-emerald-400">
                +{variables.length - 3} more
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-emerald-300"
      />
    </div>
  );
}
