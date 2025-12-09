import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserCheck, Users, User, Info } from 'lucide-react';

interface AgentTransferConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

export function AgentTransferConfig({ node, onUpdate }: AgentTransferConfigProps) {
  const [transferMode, setTransferMode] = useState<'auto' | 'specific'>(
    node.data?.autoAgentSelect ? 'auto' : 'specific'
  );
  const [agentUid, setAgentUid] = useState<string>(node.data?.agentData?.uid || '');
  const [moveToNextNode, setMoveToNextNode] = useState(node.data?.moveToNextNode ?? true);

  useEffect(() => {
    onUpdate(node.id, {
      ...node.data,
      autoAgentSelect: transferMode === 'auto',
      agentData: transferMode === 'specific' ? { uid: agentUid } : undefined,
      moveToNextNode,
    });
  }, [transferMode, agentUid, moveToNextNode]);

  return (
    <div className="space-y-4">
      {/* Info Box */}
      <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center gap-3">
        <UserCheck className="w-8 h-8 text-orange-400" />
        <div>
          <p className="text-sm font-medium text-orange-300">Transfer to Agent</p>
          <p className="text-xs text-orange-400/80">
            Assign the chat to a human agent for handling
          </p>
        </div>
      </div>

      {/* Transfer Mode Selection */}
      <div className="space-y-3">
        <Label className="text-gray-300">Assignment Mode</Label>
        <RadioGroup
          value={transferMode}
          onValueChange={(v) => setTransferMode(v as 'auto' | 'specific')}
          className="space-y-2"
        >
          <div
            className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
              transferMode === 'auto'
                ? 'bg-orange-500/10 border-orange-500/50'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => setTransferMode('auto')}
          >
            <RadioGroupItem value="auto" id="auto" />
            <Users className="w-5 h-5 text-orange-400" />
            <div className="flex-1">
              <Label htmlFor="auto" className="text-sm text-white cursor-pointer">
                Auto-Select Agent
              </Label>
              <p className="text-xs text-gray-400">
                Randomly assign to any available active agent
              </p>
            </div>
          </div>

          <div
            className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
              transferMode === 'specific'
                ? 'bg-orange-500/10 border-orange-500/50'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => setTransferMode('specific')}
          >
            <RadioGroupItem value="specific" id="specific" />
            <User className="w-5 h-5 text-orange-400" />
            <div className="flex-1">
              <Label htmlFor="specific" className="text-sm text-white cursor-pointer">
                Specific Agent
              </Label>
              <p className="text-xs text-gray-400">
                Always assign to a specific agent by UID
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Specific Agent UID */}
      {transferMode === 'specific' && (
        <div className="space-y-2">
          <Label className="text-gray-300">Agent UID</Label>
          <Input
            value={agentUid}
            onChange={(e) => setAgentUid(e.target.value)}
            placeholder="Enter agent UID..."
            className="bg-gray-800 border-gray-700 text-white font-mono"
          />
          <p className="text-xs text-gray-500">
            Find agent UID in Settings → Team → Agents
          </p>
        </div>
      )}

      {/* Info about agent availability */}
      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex gap-2">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-300">
          <p className="font-medium mb-1">How it works:</p>
          <ul className="text-blue-400/80 ml-4 list-disc space-y-0.5">
            <li>Chat appears in agent's inbox immediately</li>
            <li>Agent can respond directly to the user</li>
            <li>Auto-select only chooses from active agents</li>
            <li>Flow continues after assignment</li>
          </ul>
        </div>
      </div>

      {/* Tip: Combine with Disable Auto-Reply */}
      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-xs text-yellow-300">
          <strong>Tip:</strong> Add a "Disable Auto-Reply" node after this to prevent bot from
          interrupting the human conversation.
        </p>
      </div>

      {/* Move to Next Node */}
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-gray-300">Continue to Next Node</Label>
            <p className="text-xs text-gray-500">Proceed after agent assignment</p>
          </div>
          <Switch checked={moveToNextNode} onCheckedChange={setMoveToNextNode} />
        </div>
      </div>
    </div>
  );
}
