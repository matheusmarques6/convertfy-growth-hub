import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageSquare, Image, Video, FileText, Mic, MapPin, List, MousePointer } from 'lucide-react';
import { FlowNodeData } from '@/types/api';

const messageTypeIcons: Record<string, React.ElementType> = {
  text: MessageSquare,
  image: Image,
  video: Video,
  document: FileText,
  audio: Mic,
  location: MapPin,
  list: List,
  button: MousePointer,
};

interface SendMessageNodeProps extends NodeProps {
  data: FlowNodeData;
}

export function SendMessageNode({ data, selected }: SendMessageNodeProps) {
  const messageType = data.type?.type || 'text';
  const Icon = messageTypeIcons[messageType] || MessageSquare;

  // Get preview text
  const getPreviewText = () => {
    if (data.content?.text?.body) {
      const text = data.content.text.body;
      return text.length > 50 ? text.substring(0, 50) + '...' : text;
    }
    if (data.content?.image?.caption) return data.content.image.caption;
    if (data.content?.video?.caption) return data.content.video.caption;
    if (data.content?.interactive?.body?.text) return data.content.interactive.body.text;
    return 'Configure message...';
  };

  return (
    <div
      className={`
        px-4 py-3 rounded-xl border-2 min-w-[280px] max-w-[320px]
        bg-gradient-to-br from-blue-500/20 to-blue-600/10
        ${selected ? 'border-blue-400 shadow-lg shadow-blue-500/20' : 'border-blue-500/50'}
        transition-all duration-200
      `}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-blue-300"
      />

      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-500 flex-shrink-0">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white">Send Message</div>
          <div className="text-xs text-gray-400 capitalize mb-2">{data.type?.title || messageType}</div>
          <div className="text-xs text-gray-300 bg-black/20 rounded-lg p-2 break-words">
            {getPreviewText()}
          </div>
        </div>
      </div>

      {/* Move to next indicator */}
      {data.moveToNextNode && (
        <div className="mt-2 text-xs text-blue-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          Auto-continue
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-blue-300"
      />
    </div>
  );
}
