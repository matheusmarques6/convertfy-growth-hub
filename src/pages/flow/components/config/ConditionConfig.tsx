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
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface ConditionConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

type ConditionType =
  | 'text_exact'
  | 'text_contains'
  | 'text_starts_with'
  | 'text_ends_with'
  | 'number_equals'
  | 'number_greater'
  | 'number_less'
  | 'number_between';

interface Condition {
  id: string;
  type: ConditionType;
  value: string;
  caseSensitive: boolean;
  targetNodeId?: string;
}

const conditionLabels: Record<ConditionType, string> = {
  text_exact: 'Text Equals',
  text_contains: 'Text Contains',
  text_starts_with: 'Starts With',
  text_ends_with: 'Ends With',
  number_equals: 'Number Equals',
  number_greater: 'Greater Than',
  number_less: 'Less Than',
  number_between: 'Between (min,max)',
};

export function ConditionConfig({ node, onUpdate }: ConditionConfigProps) {
  const [conditions, setConditions] = useState<Condition[]>(
    node.data?.conditions || [
      { id: '1', type: 'text_exact', value: '', caseSensitive: false },
    ]
  );
  const [useVariables, setUseVariables] = useState(node.data?.variable?.active || false);
  const [moveToNextNode, setMoveToNextNode] = useState(node.data?.moveToNextNode ?? false);

  useEffect(() => {
    onUpdate(node.id, {
      ...node.data,
      conditions,
      variable: { active: useVariables },
      moveToNextNode,
    });
  }, [conditions, useVariables, moveToNextNode]);

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: String(Date.now()),
        type: 'text_exact',
        value: '',
        caseSensitive: false,
      },
    ]);
  };

  const removeCondition = (index: number) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((_, i) => i !== index));
    }
  };

  const updateCondition = (index: number, field: keyof Condition, value: unknown) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setConditions(newConditions);
  };

  return (
    <div className="space-y-4">
      {/* Variable Substitution */}
      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
        <div>
          <Label className="text-gray-300">Use Variables</Label>
          <p className="text-xs text-gray-500">Replace variables in incoming text</p>
        </div>
        <Switch checked={useVariables} onCheckedChange={setUseVariables} />
      </div>

      {/* Conditions List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Conditions</Label>
          <Button size="sm" variant="outline" onClick={addCondition}>
            <Plus className="w-3 h-3 mr-1" /> Add Condition
          </Button>
        </div>

        {conditions.map((condition, idx) => (
          <div
            key={condition.id}
            className="p-3 bg-gray-800/50 rounded-lg space-y-3 border border-gray-700"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-yellow-400 font-medium">
                Condition {idx + 1}
              </span>
              {conditions.length > 1 && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="ml-auto h-6 w-6"
                  onClick={() => removeCondition(idx)}
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </Button>
              )}
            </div>

            {/* Condition Type */}
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Type</Label>
              <Select
                value={condition.type}
                onValueChange={(v) => updateCondition(idx, 'type', v)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {Object.entries(conditionLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Value */}
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">
                {condition.type === 'number_between' ? 'Range (min,max)' : 'Value'}
              </Label>
              <Input
                value={condition.value}
                onChange={(e) => updateCondition(idx, 'value', e.target.value)}
                placeholder={
                  condition.type === 'number_between'
                    ? '1,10'
                    : condition.type.startsWith('number')
                    ? 'Enter number...'
                    : 'Enter text...'
                }
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Case Sensitive (only for text conditions) */}
            {condition.type.startsWith('text') && (
              <div className="flex items-center justify-between">
                <Label className="text-xs text-gray-400">Case Sensitive</Label>
                <Switch
                  checked={condition.caseSensitive}
                  onCheckedChange={(v) => updateCondition(idx, 'caseSensitive', v)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Default Fallback Info */}
      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-300">
          If no condition matches, the flow will follow the "Default" output.
        </p>
      </div>

      {/* Move to Next Node */}
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-gray-300">Auto Continue</Label>
            <p className="text-xs text-gray-500">Continue without waiting for input</p>
          </div>
          <Switch checked={moveToNextNode} onCheckedChange={setMoveToNextNode} />
        </div>
      </div>
    </div>
  );
}
