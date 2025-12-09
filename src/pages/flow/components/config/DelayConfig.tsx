import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Clock } from 'lucide-react';

interface DelayConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

export function DelayConfig({ node, onUpdate }: DelayConfigProps) {
  const [seconds, setSeconds] = useState<number>(node.data?.seconds || 5);
  const [moveToNextNode, setMoveToNextNode] = useState(node.data?.moveToNextNode ?? true);

  useEffect(() => {
    onUpdate(node.id, {
      ...node.data,
      seconds,
      moveToNextNode,
    });
  }, [seconds, moveToNextNode]);

  const formatDuration = (secs: number): string => {
    if (secs < 60) return `${secs} second${secs !== 1 ? 's' : ''}`;
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    if (remainingSecs === 0) return `${mins} minute${mins !== 1 ? 's' : ''}`;
    return `${mins}m ${remainingSecs}s`;
  };

  return (
    <div className="space-y-4">
      {/* Info Box */}
      <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center gap-3">
        <Clock className="w-8 h-8 text-purple-400" />
        <div>
          <p className="text-sm font-medium text-purple-300">Delay Node</p>
          <p className="text-xs text-purple-400/80">
            Pause the flow before continuing to the next node
          </p>
        </div>
      </div>

      {/* Seconds Input */}
      <div className="space-y-2">
        <Label className="text-gray-300">Delay Duration (seconds)</Label>
        <Input
          type="number"
          min={1}
          max={300}
          value={seconds}
          onChange={(e) => setSeconds(Math.max(1, parseInt(e.target.value) || 1))}
          className="bg-gray-800 border-gray-700 text-white text-lg font-mono"
        />
        <p className="text-sm text-purple-400">{formatDuration(seconds)}</p>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-400">Quick Presets</Label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 3, 5, 10, 15, 30, 60, 120].map((preset) => (
            <button
              key={preset}
              onClick={() => setSeconds(preset)}
              className={`px-2 py-1.5 text-xs rounded-md border transition-colors ${
                seconds === preset
                  ? 'bg-purple-500 border-purple-400 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              {preset < 60 ? `${preset}s` : `${preset / 60}m`}
            </button>
          ))}
        </div>
      </div>

      {/* Warning for long delays */}
      {seconds > 60 && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-xs text-yellow-300">
            Long delays may affect user experience. Consider using "Disable Auto-Reply" for extended pauses.
          </p>
        </div>
      )}

      {/* Move to Next Node */}
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-gray-300">Continue After Delay</Label>
            <p className="text-xs text-gray-500">Automatically proceed when delay ends</p>
          </div>
          <Switch checked={moveToNextNode} onCheckedChange={setMoveToNextNode} />
        </div>
      </div>
    </div>
  );
}
