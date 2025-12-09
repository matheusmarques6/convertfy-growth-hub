import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Bot, Info, Sparkles } from 'lucide-react';

interface AITransferConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

export function AITransferConfig({ node, onUpdate }: AITransferConfigProps) {
  const [assignedToAi, setAssignedToAi] = useState(node.data?.assignedToAi ?? true);
  const [messageReferenceCount, setMessageReferenceCount] = useState<number>(
    node.data?.messageReferenceCount || 10
  );
  const [moveToNextNode, setMoveToNextNode] = useState(node.data?.moveToNextNode ?? false);

  useEffect(() => {
    onUpdate(node.id, {
      ...node.data,
      assignedToAi,
      messageReferenceCount,
      moveToNextNode,
    });
  }, [assignedToAi, messageReferenceCount, moveToNextNode]);

  return (
    <div className="space-y-4">
      {/* Info Box */}
      <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-lg flex items-center gap-3">
        <Bot className="w-8 h-8 text-pink-400" />
        <div>
          <p className="text-sm font-medium text-pink-300">AI Assistant Transfer</p>
          <p className="text-xs text-pink-400/80">
            Let AI handle the conversation intelligently
          </p>
        </div>
      </div>

      {/* Enable AI */}
      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-pink-400" />
          <div>
            <Label className="text-gray-300">Activate AI</Label>
            <p className="text-xs text-gray-500">Enable AI to respond to messages</p>
          </div>
        </div>
        <Switch checked={assignedToAi} onCheckedChange={setAssignedToAi} />
      </div>

      {/* Message Context Count */}
      <div className="space-y-2">
        <Label className="text-gray-300">Context Messages</Label>
        <Input
          type="number"
          min={1}
          max={50}
          value={messageReferenceCount}
          onChange={(e) =>
            setMessageReferenceCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 10)))
          }
          className="bg-gray-800 border-gray-700 text-white"
        />
        <p className="text-xs text-gray-500">
          Number of previous messages to include in AI context (1-50)
        </p>
      </div>

      {/* Context Presets */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-400">Quick Presets</Label>
        <div className="grid grid-cols-4 gap-2">
          {[5, 10, 20, 50].map((preset) => (
            <button
              key={preset}
              onClick={() => setMessageReferenceCount(preset)}
              className={`px-2 py-1.5 text-xs rounded-md border transition-colors ${
                messageReferenceCount === preset
                  ? 'bg-pink-500 border-pink-400 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              {preset} msgs
            </button>
          ))}
        </div>
      </div>

      {/* How AI Works */}
      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex gap-2">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-300">
          <p className="font-medium mb-1">How AI Transfer works:</p>
          <ul className="text-blue-400/80 ml-4 list-disc space-y-0.5">
            <li>AI receives conversation history for context</li>
            <li>Responds intelligently based on configured provider</li>
            <li>Only processes text messages (media is skipped)</li>
            <li>Can trigger function calls to other nodes</li>
          </ul>
        </div>
      </div>

      {/* Supported Providers */}
      <div className="p-3 bg-gray-800/50 rounded-lg">
        <Label className="text-xs text-gray-400 mb-2 block">Supported AI Providers</Label>
        <div className="flex flex-wrap gap-2">
          {['OpenAI', 'Gemini', 'Deepseek', 'Custom'].map((provider) => (
            <span
              key={provider}
              className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
            >
              {provider}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Configure AI provider in Settings → Integrations
        </p>
      </div>

      {/* Warning */}
      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-xs text-yellow-300">
          <strong>Note:</strong> AI responses may incur additional costs from your AI provider.
          Monitor usage in your provider's dashboard.
        </p>
      </div>

      {/* Move to Next Node */}
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-gray-300">Continue to Next Node</Label>
            <p className="text-xs text-gray-500">Usually off - AI handles the flow</p>
          </div>
          <Switch checked={moveToNextNode} onCheckedChange={setMoveToNextNode} />
        </div>
      </div>
    </div>
  );
}
