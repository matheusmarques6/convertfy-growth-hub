import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Database, Info, Plus, Trash2 } from 'lucide-react';
import { CredentialSelector } from '@/components/flow/CredentialSelector';

interface DatabaseQueryConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

interface ResponseVariable {
  varName: string;
  responsePath: string;
}

type DatabaseType = 'mysql' | 'postgres';

export function DatabaseQueryConfig({ node, onUpdate }: DatabaseQueryConfigProps) {
  const data = node.data as Record<string, unknown> | undefined;

  const [databaseType, setDatabaseType] = useState<DatabaseType>(
    (data?.databaseType as DatabaseType) || 'mysql'
  );
  const [credentialId, setCredentialId] = useState<string | null>(
    (data?.credentialId as string) || null
  );
  const [query, setQuery] = useState<string>((data?.query as string) || '');
  const [responseVariables, setResponseVariables] = useState<ResponseVariable[]>(
    (data?.variables as ResponseVariable[]) || [{ varName: '', responsePath: '' }]
  );
  const [moveToNextNode, setMoveToNextNode] = useState<boolean>((data?.moveToNextNode as boolean) ?? true);

  useEffect(() => {
    onUpdate(node.id, {
      ...node.data,
      databaseType,
      credentialId,
      query,
      variables: responseVariables.filter((v) => v.varName.trim() !== ''),
      moveToNextNode,
    });
  }, [databaseType, credentialId, query, responseVariables, moveToNextNode]);

  const addVariable = () => {
    setResponseVariables([...responseVariables, { varName: '', responsePath: '' }]);
  };

  const removeVariable = (index: number) => {
    setResponseVariables(responseVariables.filter((_, i) => i !== index));
  };

  const updateVariable = (index: number, field: keyof ResponseVariable, value: string) => {
    const newVars = [...responseVariables];
    newVars[index] = { ...newVars[index], [field]: value };
    setResponseVariables(newVars);
  };

  return (
    <div className="space-y-4">
      {/* Info Box */}
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg flex items-center gap-3">
        <Database className="w-8 h-8 text-indigo-400" />
        <div>
          <p className="text-sm font-medium text-indigo-300">Database Query</p>
          <p className="text-xs text-indigo-400/80">Execute SQL queries and capture results</p>
        </div>
      </div>

      {/* Database Type */}
      <div className="space-y-2">
        <Label className="text-gray-300">Tipo de Banco de Dados</Label>
        <Select value={databaseType} onValueChange={(v) => setDatabaseType(v as DatabaseType)}>
          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="mysql">MySQL</SelectItem>
            <SelectItem value="postgres">PostgreSQL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Credential Selector */}
      <CredentialSelector
        label="Conexão do Banco de Dados"
        credentialType={databaseType === 'mysql' ? 'mysql_connection' : 'postgres_connection'}
        selectedId={credentialId}
        onChange={setCredentialId}
        description="Selecione uma conexão configurada ou crie uma nova"
      />

      {/* SQL Query */}
      <div className="space-y-2">
        <Label className="text-gray-300">SQL Query</Label>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`SELECT * FROM users WHERE phone = '{{{phone}}}'`}
          className="bg-gray-800 border-gray-700 text-white font-mono text-sm min-h-[100px]"
        />
        <p className="text-xs text-gray-500">
          Use {'{{{variavel}}}'} para inserir valores dinâmicos
        </p>
      </div>

      {/* Response Variables */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Extrair Resultados</Label>
          <Button size="sm" variant="outline" onClick={addVariable}>
            <Plus className="w-3 h-3 mr-1" /> Adicionar
          </Button>
        </div>

        {responseVariables.map((variable, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input
              value={variable.varName}
              onChange={(e) => updateVariable(idx, 'varName', e.target.value)}
              placeholder="Nome da variável"
              className="bg-gray-800 border-gray-700 text-white flex-1"
            />
            <Input
              value={variable.responsePath}
              onChange={(e) => updateVariable(idx, 'responsePath', e.target.value)}
              placeholder="response[0].column"
              className="bg-gray-800 border-gray-700 text-white flex-1 font-mono text-sm"
            />
            <Button size="icon" variant="ghost" onClick={() => removeVariable(idx)}>
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          </div>
        ))}

        <div className="p-2 bg-gray-800/50 rounded text-xs font-mono text-gray-500">
          <p>Caminhos comuns:</p>
          <p>response[0].id - Primeira linha, coluna id</p>
          <p>response[0].name - Primeira linha, coluna name</p>
          <p>response.length - Número de resultados</p>
        </div>
      </div>

      {/* Security Warning */}
      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex gap-2">
        <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-yellow-300">
          <p className="font-medium mb-1">Notas de Segurança:</p>
          <ul className="text-yellow-400/80 ml-4 list-disc space-y-0.5">
            <li>Use queries parametrizadas para prevenir SQL injection</li>
            <li>Credenciais são criptografadas no armazenamento</li>
            <li>Limite permissões do usuário do banco ao mínimo necessário</li>
          </ul>
        </div>
      </div>

      {/* Move to Next Node */}
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-gray-300">Continuar para Próximo Nó</Label>
            <p className="text-xs text-gray-500">Prosseguir após execução da query</p>
          </div>
          <Switch checked={moveToNextNode} onCheckedChange={setMoveToNextNode} />
        </div>
      </div>
    </div>
  );
}
