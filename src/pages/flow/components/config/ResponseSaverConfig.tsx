import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Info } from 'lucide-react';

interface ResponseSaverConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

interface Variable {
  varName: string;
  responsePath: string;
}

const commonPaths = [
  { label: 'Text Message Body', value: 'message.msgContext.text.body' },
  { label: 'Button Reply ID', value: 'message.msgContext.interactive.button_reply.id' },
  { label: 'Button Reply Title', value: 'message.msgContext.interactive.button_reply.title' },
  { label: 'List Reply ID', value: 'message.msgContext.interactive.list_reply.id' },
  { label: 'List Reply Title', value: 'message.msgContext.interactive.list_reply.title' },
  { label: 'Sender Phone', value: 'message.from' },
  { label: 'Message ID', value: 'message.id' },
  { label: 'Custom Path', value: 'custom' },
];

export function ResponseSaverConfig({ node, onUpdate }: ResponseSaverConfigProps) {
  const [variables, setVariables] = useState<Variable[]>(
    node.data?.variables || [{ varName: '', responsePath: 'message.msgContext.text.body' }]
  );
  const [moveToNextNode, setMoveToNextNode] = useState(node.data?.moveToNextNode ?? true);

  useEffect(() => {
    onUpdate(node.id, {
      ...node.data,
      variables: variables.filter((v) => v.varName.trim() !== ''),
      moveToNextNode,
    });
  }, [variables, moveToNextNode]);

  const addVariable = () => {
    setVariables([
      ...variables,
      { varName: '', responsePath: 'message.msgContext.text.body' },
    ]);
  };

  const removeVariable = (index: number) => {
    if (variables.length > 1) {
      setVariables(variables.filter((_, i) => i !== index));
    }
  };

  const updateVariable = (index: number, field: keyof Variable, value: string) => {
    const newVariables = [...variables];
    newVariables[index] = { ...newVariables[index], [field]: value };
    setVariables(newVariables);
  };

  const getPathType = (path: string): string => {
    const found = commonPaths.find((p) => p.value === path);
    return found ? found.value : 'custom';
  };

  return (
    <div className="space-y-4">
      {/* Info Box */}
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex gap-2">
        <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-300">
          <p className="font-medium mb-1">Save user responses as variables</p>
          <p className="text-emerald-400/80">
            Use {'{{{variableName}}}'} in subsequent nodes to reference saved values.
          </p>
        </div>
      </div>

      {/* Variables List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Variables to Save</Label>
          <Button size="sm" variant="outline" onClick={addVariable}>
            <Plus className="w-3 h-3 mr-1" /> Add Variable
          </Button>
        </div>

        {variables.map((variable, idx) => (
          <div
            key={idx}
            className="p-3 bg-gray-800/50 rounded-lg space-y-3 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-medium">
                Variable {idx + 1}
              </span>
              {variables.length > 1 && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => removeVariable(idx)}
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </Button>
              )}
            </div>

            {/* Variable Name */}
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Variable Name</Label>
              <Input
                value={variable.varName}
                onChange={(e) =>
                  updateVariable(idx, 'varName', e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))
                }
                placeholder="e.g., userName, email, phone"
                className="bg-gray-800 border-gray-700 text-white font-mono"
              />
              {variable.varName && (
                <p className="text-xs text-emerald-400 font-mono">
                  {`{{{${variable.varName}}}}`}
                </p>
              )}
            </div>

            {/* Response Path */}
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Extract From</Label>
              <Select
                value={getPathType(variable.responsePath)}
                onValueChange={(v) => {
                  if (v !== 'custom') {
                    updateVariable(idx, 'responsePath', v);
                  }
                }}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {commonPaths.map((path) => (
                    <SelectItem key={path.value} value={path.value}>
                      {path.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Path Input */}
            {getPathType(variable.responsePath) === 'custom' && (
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Custom Path</Label>
                <Input
                  value={variable.responsePath}
                  onChange={(e) => updateVariable(idx, 'responsePath', e.target.value)}
                  placeholder="e.g., response[0].data.field"
                  className="bg-gray-800 border-gray-700 text-white font-mono text-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Common Paths Reference */}
      <div className="p-3 bg-gray-800/50 rounded-lg">
        <Label className="text-xs text-gray-400 mb-2 block">Common Response Paths</Label>
        <div className="space-y-1 text-xs font-mono text-gray-500">
          <p>message.msgContext.text.body - Text content</p>
          <p>message.msgContext.interactive.button_reply.id - Button ID</p>
          <p>message.msgContext.interactive.list_reply.id - List item ID</p>
          <p>response[0].fieldName - API response data</p>
        </div>
      </div>

      {/* Move to Next Node */}
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-gray-300">Continue to Next Node</Label>
            <p className="text-xs text-gray-500">Automatically proceed after saving</p>
          </div>
          <Switch checked={moveToNextNode} onCheckedChange={setMoveToNextNode} />
        </div>
      </div>
    </div>
  );
}
