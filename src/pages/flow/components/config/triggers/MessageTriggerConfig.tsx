import { useState, useCallback } from 'react';
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
import { X, Plus, MessageCircle, Hash } from 'lucide-react';
import { MessageTriggerData } from '../../nodes/triggers/types';

interface MessageTriggerConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

export function MessageTriggerConfig({ node, onUpdate }: MessageTriggerConfigProps) {
  const data = node.data as MessageTriggerData;
  const [newKeyword, setNewKeyword] = useState('');

  const triggerType = data?.triggerType || 'any';
  const keywords = data?.keywords || [];
  const matchType = data?.matchType || 'contains';
  const caseSensitive = data?.caseSensitive || false;

  const updateData = useCallback(
    (updates: Partial<MessageTriggerData>) => {
      onUpdate(node.id, { ...data, ...updates });
    },
    [node.id, data, onUpdate]
  );

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      updateData({ keywords: [...keywords, newKeyword.trim()] });
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    updateData({ keywords: keywords.filter((k) => k !== keyword) });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <div className="space-y-6">
      {/* Trigger Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-white">Tipo de Gatilho</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => updateData({ triggerType: 'any' })}
            className={`
              p-3 rounded-lg border-2 transition-all text-left
              ${
                triggerType === 'any'
                  ? 'border-green-500 bg-green-500/20'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }
            `}
          >
            <MessageCircle
              className={`w-5 h-5 mb-2 ${
                triggerType === 'any' ? 'text-green-400' : 'text-gray-400'
              }`}
            />
            <div className="text-sm font-medium text-white">Qualquer</div>
            <div className="text-xs text-gray-400">Toda mensagem</div>
          </button>

          <button
            onClick={() => updateData({ triggerType: 'keyword' })}
            className={`
              p-3 rounded-lg border-2 transition-all text-left
              ${
                triggerType === 'keyword'
                  ? 'border-green-500 bg-green-500/20'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }
            `}
          >
            <Hash
              className={`w-5 h-5 mb-2 ${
                triggerType === 'keyword' ? 'text-green-400' : 'text-gray-400'
              }`}
            />
            <div className="text-sm font-medium text-white">Palavra-chave</div>
            <div className="text-xs text-gray-400">Mensagem específica</div>
          </button>
        </div>
      </div>

      {/* Keywords Section - Only show if keyword type */}
      {triggerType === 'keyword' && (
        <>
          {/* Match Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white">Tipo de Correspondência</Label>
            <Select
              value={matchType}
              onValueChange={(value) =>
                updateData({ matchType: value as MessageTriggerData['matchType'] })
              }
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="contains" className="text-white hover:bg-gray-700">
                  Contém
                </SelectItem>
                <SelectItem value="exact" className="text-white hover:bg-gray-700">
                  Igual a (exato)
                </SelectItem>
                <SelectItem value="starts_with" className="text-white hover:bg-gray-700">
                  Começa com
                </SelectItem>
                <SelectItem value="regex" className="text-white hover:bg-gray-700">
                  Expressão Regular
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Keywords List */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white">Palavras-chave</Label>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite uma palavra-chave..."
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button
                onClick={addKeyword}
                size="icon"
                variant="outline"
                className="border-gray-700 hover:bg-gray-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Keywords Tags */}
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm border border-green-500/30"
                  >
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {keywords.length === 0 && (
              <p className="text-xs text-yellow-400 mt-2">
                Adicione pelo menos uma palavra-chave para ativar o gatilho.
              </p>
            )}
          </div>

          {/* Case Sensitive */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-white">
                Diferenciar maiúsculas/minúsculas
              </Label>
              <p className="text-xs text-gray-400 mt-0.5">
                "Oi" será diferente de "oi"
              </p>
            </div>
            <Switch
              checked={caseSensitive}
              onCheckedChange={(checked) => updateData({ caseSensitive: checked })}
            />
          </div>
        </>
      )}

      {/* Info Box */}
      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-300">
          {triggerType === 'any' ? (
            <>
              <strong>Qualquer mensagem</strong> recebida irá iniciar este flow.
              Use este modo para bots de atendimento geral.
            </>
          ) : (
            <>
              O flow será iniciado apenas quando a mensagem{' '}
              <strong>
                {matchType === 'exact'
                  ? 'for igual a'
                  : matchType === 'starts_with'
                  ? 'começar com'
                  : matchType === 'regex'
                  ? 'corresponder à regex'
                  : 'contiver'}
              </strong>{' '}
              uma das palavras-chave configuradas.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
