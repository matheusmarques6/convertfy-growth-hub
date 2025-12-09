import { Handle, Position, NodeProps } from '@xyflow/react';
import { Globe } from 'lucide-react';
import { FlowNodeData } from '@/types/api';

interface MakeRequestNodeProps extends NodeProps {
  data: FlowNodeData;
}

export function MakeRequestNode({ data, selected }: MakeRequestNodeProps) {
  const method = data.method || 'GET';
  const url = data.url || 'Configure URL...';

  const methodColors: Record<string, string> = {
    GET: 'bg-green-500',
    POST: 'bg-blue-500',
    PUT: 'bg-yellow-500',
    DELETE: 'bg-red-500',
    PATCH: 'bg-purple-500',
  };

  return (
    <div
      className={`
        px-4 py-3 rounded-xl border-2 min-w-[280px] max-w-[320px]
        bg-gradient-to-br from-cyan-500/20 to-cyan-600/10
        ${selected ? 'border-cyan-400 shadow-lg shadow-cyan-500/20' : 'border-cyan-500/50'}
        transition-all duration-200
      `}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-cyan-300"
      />

      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-cyan-500 flex-shrink-0">
          <Globe className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white">HTTP Request</div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded ${methodColors[method]} text-white font-mono`}>
              {method}
            </span>
          </div>
          <div className="text-xs text-gray-300 bg-black/20 rounded-lg p-2 mt-2 break-all font-mono">
            {url.length > 40 ? url.substring(0, 40) + '...' : url}
          </div>
        </div>
      </div>

      {/* Variables indicator */}
      {data.variables && data.variables.length > 0 && (
        <div className="mt-2 text-xs text-cyan-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          {data.variables.length} variable{data.variables.length !== 1 ? 's' : ''} saved
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-cyan-300"
      />
    </div>
  );
}
