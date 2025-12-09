import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';

export function InitialNode({ selected }: NodeProps) {
  return (
    <div
      className={`
        px-4 py-3 rounded-xl border-2 min-w-[200px]
        bg-gradient-to-br from-green-500/20 to-green-600/10
        ${selected ? 'border-green-400 shadow-lg shadow-green-500/20' : 'border-green-500/50'}
        transition-all duration-200
      `}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-green-500">
          <Play className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Start</div>
          <div className="text-xs text-gray-400">Flow begins here</div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="handle1"
        className="!w-3 !h-3 !bg-green-500 !border-2 !border-green-300"
      />
    </div>
  );
}
