import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Database, Info, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface DatabaseQueryConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

interface ResponseVariable {
  varName: string;
  responsePath: string;
}

export function DatabaseQueryConfig({ node, onUpdate }: DatabaseQueryConfigProps) {
  const [host, setHost] = useState<string>(node.data?.connection?.host || '');
  const [port, setPort] = useState<number>(node.data?.connection?.port || 3306);
  const [username, setUsername] = useState<string>(node.data?.connection?.username || '');
  const [password, setPassword] = useState<string>(node.data?.connection?.password || '');
  const [database, setDatabase] = useState<string>(node.data?.connection?.database || '');
  const [ssl, setSsl] = useState<boolean>(node.data?.connection?.ssl || false);
  const [query, setQuery] = useState<string>(node.data?.query || '');
  const [responseVariables, setResponseVariables] = useState<ResponseVariable[]>(
    node.data?.variables || [{ varName: '', responsePath: '' }]
  );
  const [moveToNextNode, setMoveToNextNode] = useState(node.data?.moveToNextNode ?? true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    onUpdate(node.id, {
      ...node.data,
      connection: {
        host,
        port,
        username,
        password,
        database,
        ssl,
      },
      query,
      variables: responseVariables.filter((v) => v.varName.trim() !== ''),
      moveToNextNode,
    });
  }, [host, port, username, password, database, ssl, query, responseVariables, moveToNextNode]);

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
          <p className="text-sm font-medium text-indigo-300">MySQL Query</p>
          <p className="text-xs text-indigo-400/80">Execute SQL queries and capture results</p>
        </div>
      </div>

      {/* Connection Settings */}
      <div className="space-y-3 p-3 bg-gray-800/50 rounded-lg">
        <Label className="text-gray-300">Connection</Label>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-gray-400">Host</Label>
            <Input
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="localhost"
              className="bg-gray-800 border-gray-700 text-white font-mono text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-400">Port</Label>
            <Input
              type="number"
              value={port}
              onChange={(e) => setPort(parseInt(e.target.value) || 3306)}
              placeholder="3306"
              className="bg-gray-800 border-gray-700 text-white font-mono text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-gray-400">Database</Label>
          <Input
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
            placeholder="my_database"
            className="bg-gray-800 border-gray-700 text-white font-mono text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-gray-400">Username</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="root"
            className="bg-gray-800 border-gray-700 text-white font-mono text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-gray-400">Password</Label>
          <div className="flex gap-2">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="bg-gray-800 border-gray-700 text-white font-mono text-sm flex-1"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-400">Use SSL</Label>
          <Switch checked={ssl} onCheckedChange={setSsl} />
        </div>
      </div>

      {/* SQL Query */}
      <div className="space-y-2">
        <Label className="text-gray-300">SQL Query</Label>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SELECT * FROM users WHERE phone = ?"
          className="bg-gray-800 border-gray-700 text-white font-mono text-sm min-h-[100px]"
        />
        <p className="text-xs text-gray-500">
          Use ? for parameterized queries. Parameters are filled from variables array.
        </p>
      </div>

      {/* Response Variables */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Extract Results</Label>
          <Button size="sm" variant="outline" onClick={addVariable}>
            <Plus className="w-3 h-3 mr-1" /> Add Variable
          </Button>
        </div>

        {responseVariables.map((variable, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input
              value={variable.varName}
              onChange={(e) => updateVariable(idx, 'varName', e.target.value)}
              placeholder="Variable name"
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
          <p>Common paths:</p>
          <p>response[0].id - First row, id column</p>
          <p>response[0].name - First row, name column</p>
          <p>response.length - Number of results</p>
        </div>
      </div>

      {/* Security Warning */}
      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex gap-2">
        <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-yellow-300">
          <p className="font-medium mb-1">Security Notes:</p>
          <ul className="text-yellow-400/80 ml-4 list-disc space-y-0.5">
            <li>Always use parameterized queries (?) to prevent SQL injection</li>
            <li>Credentials are stored in the flow data - use read-only users</li>
            <li>Limit database user permissions to minimum required</li>
          </ul>
        </div>
      </div>

      {/* Move to Next Node */}
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-gray-300">Continue to Next Node</Label>
            <p className="text-xs text-gray-500">Proceed after query execution</p>
          </div>
          <Switch checked={moveToNextNode} onCheckedChange={setMoveToNextNode} />
        </div>
      </div>
    </div>
  );
}
