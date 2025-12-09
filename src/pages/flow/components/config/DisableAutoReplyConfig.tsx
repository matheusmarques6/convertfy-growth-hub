import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { PauseCircle, AlertCircle } from 'lucide-react';

interface DisableAutoReplyConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

export function DisableAutoReplyConfig({ node, onUpdate }: DisableAutoReplyConfigProps) {
  const [hours, setHours] = useState<number>(node.data?.hours || 0);
  const [minutes, setMinutes] = useState<number>(node.data?.minutes || 30);
  const [moveToNextNode, setMoveToNextNode] = useState(node.data?.moveToNextNode ?? true);

  useEffect(() => {
    onUpdate(node.id, {
      ...node.data,
      hours,
      minutes,
      moveToNextNode,
    });
  }, [hours, minutes, moveToNextNode]);

  const formatDuration = (): string => {
    const parts = [];
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    return parts.join(' and ') || '0 minutes';
  };

  const totalMinutes = hours * 60 + minutes;

  return (
    <div className="space-y-4">
      {/* Info Box */}
      <div className="p-4 bg-gray-500/10 border border-gray-500/30 rounded-lg flex items-center gap-3">
        <PauseCircle className="w-8 h-8 text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-300">Disable Auto-Reply</p>
          <p className="text-xs text-gray-400">
            Temporarily pause bot responses for this user
          </p>
        </div>
      </div>

      {/* Duration Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-300">Hours</Label>
          <Input
            type="number"
            min={0}
            max={24}
            value={hours}
            onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
            className="bg-gray-800 border-gray-700 text-white text-lg font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Minutes</Label>
          <Input
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            className="bg-gray-800 border-gray-700 text-white text-lg font-mono"
          />
        </div>
      </div>

      {/* Duration Display */}
      <div className="p-3 bg-gray-800/50 rounded-lg text-center">
        <p className="text-sm text-gray-400">Bot will be paused for</p>
        <p className="text-lg font-medium text-white">{formatDuration()}</p>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-400">Quick Presets</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { h: 0, m: 15, label: '15 min' },
            { h: 0, m: 30, label: '30 min' },
            { h: 1, m: 0, label: '1 hour' },
            { h: 2, m: 0, label: '2 hours' },
            { h: 4, m: 0, label: '4 hours' },
            { h: 24, m: 0, label: '24 hours' },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setHours(preset.h);
                setMinutes(preset.m);
              }}
              className={`px-2 py-1.5 text-xs rounded-md border transition-colors ${
                hours === preset.h && minutes === preset.m
                  ? 'bg-gray-500 border-gray-400 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Warning */}
      {totalMinutes === 0 && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">
            Duration must be at least 1 minute. Current setting will not disable auto-reply.
          </p>
        </div>
      )}

      {/* Use Case Info */}
      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-300">
          <strong>Common use cases:</strong>
        </p>
        <ul className="text-xs text-blue-400/80 mt-1 ml-4 list-disc">
          <li>After transferring to a human agent</li>
          <li>During business hours when staff handles chats</li>
          <li>When user requests to pause bot messages</li>
        </ul>
      </div>

      {/* Move to Next Node */}
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-gray-300">Continue to Next Node</Label>
            <p className="text-xs text-gray-500">Proceed after disabling auto-reply</p>
          </div>
          <Switch checked={moveToNextNode} onCheckedChange={setMoveToNextNode} />
        </div>
      </div>
    </div>
  );
}
