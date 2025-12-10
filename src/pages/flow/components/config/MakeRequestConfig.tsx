import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Globe, Info, Lock } from 'lucide-react';
import { CredentialSelector } from '@/components/flow/CredentialSelector';

type AuthType = 'none' | 'basic' | 'bearer' | 'api_key';

interface MakeRequestConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type ContentType = 'application/json' | 'application/x-www-form-urlencoded' | 'text/plain';

interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

interface BodyField {
  key: string;
  value: string;
  enabled: boolean;
}

interface ResponseVariable {
  key: string;
  value: string;
}

export function MakeRequestConfig({ node, onUpdate }: MakeRequestConfigProps) {
  const data = node.data as Record<string, unknown> | undefined;
  const bodyData = data?.bodyData as { json?: BodyField[]; raw?: string } | undefined;

  const [method, setMethod] = useState<HttpMethod>((data?.method as HttpMethod) || 'GET');
  const [url, setUrl] = useState<string>((data?.url as string) || '');
  const [headers, setHeaders] = useState<Header[]>(
    (data?.headers as Header[]) || [{ key: '', value: '', enabled: true }]
  );
  const [contentType, setContentType] = useState<ContentType>(
    (data?.contentType as ContentType) || 'application/json'
  );
  const [bodyInputMode, setBodyInputMode] = useState<'visual' | 'raw'>(
    (data?.bodyInputMode as 'visual' | 'raw') || 'visual'
  );
  const [bodyFields, setBodyFields] = useState<BodyField[]>(
    bodyData?.json || [{ key: '', value: '', enabled: true }]
  );
  const [rawBody, setRawBody] = useState<string>(bodyData?.raw || '');
  const [responseVariables, setResponseVariables] = useState<ResponseVariable[]>(
    (data?.variables as ResponseVariable[]) || [{ key: '', value: '' }]
  );
  const [moveToNextNode, setMoveToNextNode] = useState<boolean>((data?.moveToNextNode as boolean) ?? true);

  // Authentication state
  const [authType, setAuthType] = useState<AuthType>((data?.authType as AuthType) || 'none');
  const [credentialId, setCredentialId] = useState<string | null>((data?.credentialId as string) || null);

  useEffect(() => {
    onUpdate(node.id, {
      ...node.data,
      method,
      url,
      headers: headers.filter((h) => h.key.trim() !== ''),
      contentType,
      bodyInputMode,
      bodyData: {
        json: bodyFields.filter((f) => f.key.trim() !== ''),
        raw: rawBody,
      },
      variables: responseVariables.filter((v) => v.key.trim() !== ''),
      moveToNextNode,
      authType,
      credentialId,
    });
  }, [method, url, headers, contentType, bodyInputMode, bodyFields, rawBody, responseVariables, moveToNextNode, authType, credentialId]);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: keyof Header, value: string | boolean) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    setHeaders(newHeaders);
  };

  const addBodyField = () => {
    setBodyFields([...bodyFields, { key: '', value: '', enabled: true }]);
  };

  const removeBodyField = (index: number) => {
    setBodyFields(bodyFields.filter((_, i) => i !== index));
  };

  const updateBodyField = (index: number, field: keyof BodyField, value: string | boolean) => {
    const newFields = [...bodyFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setBodyFields(newFields);
  };

  const addResponseVariable = () => {
    setResponseVariables([...responseVariables, { key: '', value: '' }]);
  };

  const removeResponseVariable = (index: number) => {
    setResponseVariables(responseVariables.filter((_, i) => i !== index));
  };

  const updateResponseVariable = (index: number, field: keyof ResponseVariable, value: string) => {
    const newVars = [...responseVariables];
    newVars[index] = { ...newVars[index], [field]: value };
    setResponseVariables(newVars);
  };

  const methodColors: Record<HttpMethod, string> = {
    GET: 'bg-green-500',
    POST: 'bg-blue-500',
    PUT: 'bg-yellow-500',
    DELETE: 'bg-red-500',
    PATCH: 'bg-purple-500',
  };

  return (
    <div className="space-y-4">
      {/* Info Box */}
      <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center gap-3">
        <Globe className="w-8 h-8 text-cyan-400" />
        <div>
          <p className="text-sm font-medium text-cyan-300">HTTP Request</p>
          <p className="text-xs text-cyan-400/80">Call external APIs and save response data</p>
        </div>
      </div>

      {/* Method & URL */}
      <div className="space-y-2">
        <Label className="text-gray-300">Request</Label>
        <div className="flex gap-2">
          <Select value={method} onValueChange={(v) => setMethod(v as HttpMethod)}>
            <SelectTrigger className={`w-28 ${methodColors[method]} text-white border-0`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as HttpMethod[]).map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="bg-gray-800 border-gray-700 text-white flex-1 font-mono text-sm"
          />
        </div>
        <p className="text-xs text-gray-500">
          Use {'{{{variable}}}'} for dynamic values
        </p>
      </div>

      {/* Tabs for Auth, Headers, Body, Response */}
      <Tabs defaultValue="auth" className="w-full">
        <TabsList className="w-full bg-gray-800">
          <TabsTrigger value="auth" className="flex-1">
            <Lock className="w-3 h-3 mr-1" />
            Auth
          </TabsTrigger>
          <TabsTrigger value="headers" className="flex-1">
            Headers
          </TabsTrigger>
          <TabsTrigger value="body" className="flex-1" disabled={method === 'GET'}>
            Body
          </TabsTrigger>
          <TabsTrigger value="response" className="flex-1">
            Response
          </TabsTrigger>
        </TabsList>

        {/* Auth Tab */}
        <TabsContent value="auth" className="space-y-3 mt-3">
          <div className="space-y-2">
            <Label className="text-gray-300">Tipo de Autenticação</Label>
            <Select value={authType} onValueChange={(v) => setAuthType(v as AuthType)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="none">Sem Autenticação</SelectItem>
                <SelectItem value="basic">HTTP Basic Auth</SelectItem>
                <SelectItem value="bearer">Bearer Token</SelectItem>
                <SelectItem value="api_key">API Key</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {authType !== 'none' && (
            <CredentialSelector
              label="Credential"
              credentialType={
                authType === 'basic'
                  ? 'http_basic'
                  : authType === 'bearer'
                  ? 'http_bearer'
                  : 'http_api_key'
              }
              selectedId={credentialId}
              onChange={setCredentialId}
              description="Selecione uma credential salva ou crie uma nova"
            />
          )}

          {authType === 'none' && (
            <div className="p-3 bg-gray-800/50 rounded-lg text-xs text-gray-400">
              <p>Nenhuma autenticação será enviada com a requisição.</p>
              <p className="mt-1">
                Para adicionar headers de autenticação manualmente, use a aba Headers.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Headers Tab */}
        <TabsContent value="headers" className="space-y-2 mt-3">
          {headers.map((header, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <Input
                value={header.key}
                onChange={(e) => updateHeader(idx, 'key', e.target.value)}
                placeholder="Header name"
                className="bg-gray-800 border-gray-700 text-white flex-1 text-sm"
              />
              <Input
                value={header.value}
                onChange={(e) => updateHeader(idx, 'value', e.target.value)}
                placeholder="Value"
                className="bg-gray-800 border-gray-700 text-white flex-1 text-sm"
              />
              <Button size="icon" variant="ghost" onClick={() => removeHeader(idx)}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={addHeader}>
            <Plus className="w-3 h-3 mr-1" /> Add Header
          </Button>
        </TabsContent>

        {/* Body Tab */}
        <TabsContent value="body" className="space-y-3 mt-3">
          <div className="space-y-2">
            <Label className="text-xs text-gray-400">Content Type</Label>
            <Select value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="application/json">JSON</SelectItem>
                <SelectItem value="application/x-www-form-urlencoded">Form URL Encoded</SelectItem>
                <SelectItem value="text/plain">Text/Plain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={bodyInputMode === 'visual' ? 'default' : 'outline'}
              onClick={() => setBodyInputMode('visual')}
            >
              Visual
            </Button>
            <Button
              size="sm"
              variant={bodyInputMode === 'raw' ? 'default' : 'outline'}
              onClick={() => setBodyInputMode('raw')}
            >
              Raw
            </Button>
          </div>

          {bodyInputMode === 'visual' ? (
            <div className="space-y-2">
              {bodyFields.map((field, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    value={field.key}
                    onChange={(e) => updateBodyField(idx, 'key', e.target.value)}
                    placeholder="Key"
                    className="bg-gray-800 border-gray-700 text-white flex-1 text-sm"
                  />
                  <Input
                    value={field.value}
                    onChange={(e) => updateBodyField(idx, 'value', e.target.value)}
                    placeholder="Value"
                    className="bg-gray-800 border-gray-700 text-white flex-1 text-sm"
                  />
                  <Button size="icon" variant="ghost" onClick={() => removeBodyField(idx)}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={addBodyField}>
                <Plus className="w-3 h-3 mr-1" /> Add Field
              </Button>
            </div>
          ) : (
            <Textarea
              value={rawBody}
              onChange={(e) => setRawBody(e.target.value)}
              placeholder={
                contentType === 'application/json'
                  ? '{\n  "key": "value"\n}'
                  : 'Enter raw body...'
              }
              className="bg-gray-800 border-gray-700 text-white font-mono text-sm min-h-[120px]"
            />
          )}
        </TabsContent>

        {/* Response Tab */}
        <TabsContent value="response" className="space-y-3 mt-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex gap-2">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300">
              Extract data from the API response and save as variables for later use.
            </p>
          </div>

          <Label className="text-gray-300">Response Variables</Label>
          {responseVariables.map((variable, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <Input
                value={variable.key}
                onChange={(e) => updateResponseVariable(idx, 'key', e.target.value)}
                placeholder="Variable name"
                className="bg-gray-800 border-gray-700 text-white flex-1 text-sm"
              />
              <Input
                value={variable.value}
                onChange={(e) => updateResponseVariable(idx, 'value', e.target.value)}
                placeholder="body.data.field"
                className="bg-gray-800 border-gray-700 text-white flex-1 text-sm font-mono"
              />
              <Button size="icon" variant="ghost" onClick={() => removeResponseVariable(idx)}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={addResponseVariable}>
            <Plus className="w-3 h-3 mr-1" /> Add Variable
          </Button>

          <div className="p-2 bg-gray-800/50 rounded text-xs font-mono text-gray-500">
            <p>Common paths:</p>
            <p>body.data - Response data</p>
            <p>body.results[0].name - Array element</p>
            <p>body.user.email - Nested object</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Move to Next Node */}
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-gray-300">Continue to Next Node</Label>
            <p className="text-xs text-gray-500">Proceed after request completes</p>
          </div>
          <Switch checked={moveToNextNode} onCheckedChange={setMoveToNextNode} />
        </div>
      </div>
    </div>
  );
}
