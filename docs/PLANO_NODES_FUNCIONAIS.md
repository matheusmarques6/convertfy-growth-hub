# Plano de Ação: Nodes Funcionais com Credentials

> Plano para implementar nodes que realmente executam, com sistema de credentials integrado.

---

## Situação Atual

### O que temos:
- ✅ Nodes visuais (MakeRequestNode, SendMessageNode, etc)
- ✅ Painéis de configuração (MakeRequestConfig, etc)
- ✅ Flow Builder funcional com drag & drop
- ✅ Salvamento em localStorage
- ✅ Lista de flows estilo N8N

### O que falta:
- ❌ Sistema de Credentials centralizado
- ❌ Seletor de credential nos nodes
- ❌ Lógica de execução real dos nodes
- ❌ Engine de execução do flow
- ❌ Teste de conexão para credentials
- ❌ Variáveis de contexto entre nodes

---

## Fase 1: Sistema de Credentials (Prioridade Alta)

### 1.1 Criar Tipos de Credentials

```
src/types/credentials.ts
```

```typescript
// Tipos base
export type CredentialType =
  | 'whatsapp_api'      // API do WhatsApp Business
  | 'openai_api'        // OpenAI para IA
  | 'http_basic'        // Basic Auth
  | 'http_bearer'       // Bearer Token
  | 'mysql_connection'  // MySQL Database
  | 'google_sheets'     // Google Sheets OAuth
  | 'webhook_secret';   // Webhook com secret

// Interface de definição de credential (como N8N)
export interface ICredentialTypeDefinition {
  name: CredentialType;
  displayName: string;
  icon: string;
  description: string;
  documentationUrl?: string;

  // Campos do formulário
  properties: ICredentialProperty[];

  // Teste de conexão
  test?: {
    request: {
      url: string;
      method: 'GET' | 'POST';
    };
  };
}

export interface ICredentialProperty {
  name: string;
  displayName: string;
  type: 'string' | 'password' | 'number' | 'options' | 'boolean';
  default?: unknown;
  required?: boolean;
  placeholder?: string;
  description?: string;
  options?: { name: string; value: string }[];
}

// Credential salva (dados criptografados)
export interface IStoredCredential {
  id: string;
  name: string;           // Nome dado pelo usuário
  type: CredentialType;   // Tipo da credential
  data: string;           // JSON criptografado
  createdAt: string;
  updatedAt: string;
}

// Credential descriptografada (para uso)
export interface ICredentialData {
  [key: string]: string | number | boolean;
}
```

### 1.2 Definições de Credentials

```
src/services/credentials/definitions/
├── index.ts
├── whatsappApi.ts
├── openaiApi.ts
├── httpBasic.ts
├── httpBearer.ts
├── mysqlConnection.ts
└── googleSheets.ts
```

**Exemplo: whatsappApi.ts**
```typescript
import { ICredentialTypeDefinition } from '@/types/credentials';

export const whatsappApiCredential: ICredentialTypeDefinition = {
  name: 'whatsapp_api',
  displayName: 'WhatsApp Business API',
  icon: 'MessageCircle',
  description: 'Connect to WhatsApp Business API',

  properties: [
    {
      name: 'apiUrl',
      displayName: 'API URL',
      type: 'string',
      required: true,
      placeholder: 'https://api.whatsapp.com/v1',
      description: 'Base URL of your WhatsApp API',
    },
    {
      name: 'accessToken',
      displayName: 'Access Token',
      type: 'password',
      required: true,
      description: 'Your WhatsApp API access token',
    },
    {
      name: 'phoneNumberId',
      displayName: 'Phone Number ID',
      type: 'string',
      required: true,
      description: 'The phone number ID from Meta',
    },
  ],

  test: {
    request: {
      url: '{{apiUrl}}/{{phoneNumberId}}',
      method: 'GET',
    },
  },
};
```

**Exemplo: openaiApi.ts**
```typescript
export const openaiApiCredential: ICredentialTypeDefinition = {
  name: 'openai_api',
  displayName: 'OpenAI API',
  icon: 'Brain',
  description: 'Connect to OpenAI GPT models',

  properties: [
    {
      name: 'apiKey',
      displayName: 'API Key',
      type: 'password',
      required: true,
      placeholder: 'sk-...',
    },
    {
      name: 'organization',
      displayName: 'Organization ID',
      type: 'string',
      required: false,
      placeholder: 'org-...',
    },
    {
      name: 'model',
      displayName: 'Default Model',
      type: 'options',
      default: 'gpt-4',
      options: [
        { name: 'GPT-4', value: 'gpt-4' },
        { name: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
        { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
      ],
    },
  ],

  test: {
    request: {
      url: 'https://api.openai.com/v1/models',
      method: 'GET',
    },
  },
};
```

### 1.3 Serviço de Credentials

```
src/services/credentials/credentialsService.ts
```

```typescript
import CryptoJS from 'crypto-js';
import { IStoredCredential, ICredentialData, CredentialType } from '@/types/credentials';

const STORAGE_KEY = 'convertfy_credentials';
const ENCRYPTION_KEY = 'your-secret-key'; // TODO: usar variável de ambiente

export const credentialsService = {
  // Listar todas credentials
  getAll(): IStoredCredential[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Buscar por tipo
  getByType(type: CredentialType): IStoredCredential[] {
    return this.getAll().filter(c => c.type === type);
  },

  // Buscar por ID
  getById(id: string): IStoredCredential | null {
    return this.getAll().find(c => c.id === id) || null;
  },

  // Criar credential
  create(name: string, type: CredentialType, data: ICredentialData): IStoredCredential {
    const credentials = this.getAll();
    const now = new Date().toISOString();

    const newCredential: IStoredCredential = {
      id: `cred_${Date.now()}`,
      name,
      type,
      data: this.encrypt(data),
      createdAt: now,
      updatedAt: now,
    };

    credentials.push(newCredential);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
    return newCredential;
  },

  // Atualizar credential
  update(id: string, updates: Partial<{ name: string; data: ICredentialData }>): IStoredCredential | null {
    const credentials = this.getAll();
    const index = credentials.findIndex(c => c.id === id);

    if (index === -1) return null;

    if (updates.name) {
      credentials[index].name = updates.name;
    }
    if (updates.data) {
      credentials[index].data = this.encrypt(updates.data);
    }
    credentials[index].updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
    return credentials[index];
  },

  // Deletar credential
  delete(id: string): boolean {
    const credentials = this.getAll();
    const filtered = credentials.filter(c => c.id !== id);

    if (filtered.length === credentials.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Descriptografar dados
  decrypt(id: string): ICredentialData | null {
    const credential = this.getById(id);
    if (!credential) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(credential.data, ENCRYPTION_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
      return null;
    }
  },

  // Criptografar dados
  encrypt(data: ICredentialData): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  },

  // Testar conexão
  async test(type: CredentialType, data: ICredentialData): Promise<{ success: boolean; message: string }> {
    // Implementar lógica de teste baseado no tipo
    try {
      // TODO: Fazer request de teste
      return { success: true, message: 'Connection successful' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};
```

### 1.4 Store de Credentials (Zustand)

```
src/store/credentialsStore.ts
```

```typescript
import { create } from 'zustand';
import { credentialsService } from '@/services/credentials/credentialsService';
import { IStoredCredential, ICredentialData, CredentialType } from '@/types/credentials';

interface CredentialsState {
  credentials: IStoredCredential[];
  isLoading: boolean;

  // Actions
  fetchAll: () => void;
  create: (name: string, type: CredentialType, data: ICredentialData) => IStoredCredential;
  update: (id: string, updates: Partial<{ name: string; data: ICredentialData }>) => void;
  delete: (id: string) => void;
  getByType: (type: CredentialType) => IStoredCredential[];
  decrypt: (id: string) => ICredentialData | null;
}

export const useCredentialsStore = create<CredentialsState>((set, get) => ({
  credentials: [],
  isLoading: false,

  fetchAll: () => {
    set({ isLoading: true });
    const credentials = credentialsService.getAll();
    set({ credentials, isLoading: false });
  },

  create: (name, type, data) => {
    const newCredential = credentialsService.create(name, type, data);
    set(state => ({ credentials: [...state.credentials, newCredential] }));
    return newCredential;
  },

  update: (id, updates) => {
    credentialsService.update(id, updates);
    get().fetchAll();
  },

  delete: (id) => {
    credentialsService.delete(id);
    set(state => ({ credentials: state.credentials.filter(c => c.id !== id) }));
  },

  getByType: (type) => {
    return get().credentials.filter(c => c.type === type);
  },

  decrypt: (id) => {
    return credentialsService.decrypt(id);
  },
}));
```

---

## Fase 2: Tab de Credentials na FlowsList

### 2.1 Componente CredentialsList

```
src/pages/flows/components/CredentialsList.tsx
```

- Lista todas as credentials salvas
- Botão "Create Credential" abre modal
- Cada item mostra: nome, tipo, data de criação
- Ações: Edit, Delete, Test Connection

### 2.2 Modal de Criação/Edição

```
src/pages/flows/components/CredentialModal.tsx
```

- Select para escolher tipo de credential
- Form dinâmico baseado nas `properties` do tipo
- Botão "Test Connection"
- Salvar/Cancelar

---

## Fase 3: Seletor de Credentials nos Nodes

### 3.1 Componente CredentialSelector

```
src/components/flow/CredentialSelector.tsx
```

```typescript
interface CredentialSelectorProps {
  credentialType: CredentialType;
  selectedId: string | null;
  onChange: (credentialId: string | null) => void;
}

export function CredentialSelector({ credentialType, selectedId, onChange }: CredentialSelectorProps) {
  const credentials = useCredentialsStore(state => state.getByType(credentialType));

  return (
    <div className="space-y-2">
      <Label>Credential</Label>
      <Select value={selectedId || ''} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a credential..." />
        </SelectTrigger>
        <SelectContent>
          {credentials.map(cred => (
            <SelectItem key={cred.id} value={cred.id}>
              {cred.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="link" size="sm" onClick={() => /* open modal */}>
        + Create new credential
      </Button>
    </div>
  );
}
```

### 3.2 Atualizar Configs para usar CredentialSelector

**Exemplo: MakeRequestConfig.tsx**
```typescript
// Adicionar no início do componente:
const [credentialId, setCredentialId] = useState<string | null>(node.data?.credentialId || null);
const [authType, setAuthType] = useState<'none' | 'basic' | 'bearer'>(node.data?.authType || 'none');

// Adicionar no JSX:
<div className="space-y-3">
  <Label>Authentication</Label>
  <Select value={authType} onValueChange={setAuthType}>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="none">No Auth</SelectItem>
      <SelectItem value="basic">Basic Auth</SelectItem>
      <SelectItem value="bearer">Bearer Token</SelectItem>
    </SelectContent>
  </Select>

  {authType !== 'none' && (
    <CredentialSelector
      credentialType={authType === 'basic' ? 'http_basic' : 'http_bearer'}
      selectedId={credentialId}
      onChange={setCredentialId}
    />
  )}
</div>
```

---

## Fase 4: Engine de Execução

### 4.1 Interface de Execução de Node

```
src/services/flow/nodeExecutors/types.ts
```

```typescript
export interface INodeExecutionContext {
  // Dados de entrada
  input: {
    message?: string;           // Mensagem recebida
    contact?: IContact;         // Contato atual
    variables: Record<string, unknown>;  // Variáveis do flow
  };

  // Funções auxiliares
  getCredential: (id: string) => ICredentialData | null;
  setVariable: (key: string, value: unknown) => void;
  log: (message: string) => void;
}

export interface INodeExecutionResult {
  success: boolean;
  output?: Record<string, unknown>;
  error?: string;
  nextNodeId?: string;  // Para condições
}

export type NodeExecutor = (
  nodeData: Record<string, unknown>,
  context: INodeExecutionContext
) => Promise<INodeExecutionResult>;
```

### 4.2 Executors por Tipo de Node

```
src/services/flow/nodeExecutors/
├── index.ts
├── makeRequestExecutor.ts
├── sendMessageExecutor.ts
├── conditionExecutor.ts
├── delayExecutor.ts
├── aiTransferExecutor.ts
└── databaseQueryExecutor.ts
```

**Exemplo: makeRequestExecutor.ts**
```typescript
import axios from 'axios';
import { NodeExecutor, INodeExecutionResult } from './types';

export const makeRequestExecutor: NodeExecutor = async (nodeData, context) => {
  const { method, url, headers, bodyData, credentialId, authType, variables } = nodeData;

  try {
    // Substituir variáveis na URL
    let finalUrl = url as string;
    for (const [key, value] of Object.entries(context.input.variables)) {
      finalUrl = finalUrl.replace(`{{{${key}}}}`, String(value));
    }

    // Preparar headers
    const requestHeaders: Record<string, string> = {};

    // Adicionar auth se configurado
    if (authType !== 'none' && credentialId) {
      const credential = context.getCredential(credentialId as string);
      if (credential) {
        if (authType === 'bearer') {
          requestHeaders['Authorization'] = `Bearer ${credential.token}`;
        } else if (authType === 'basic') {
          const auth = btoa(`${credential.username}:${credential.password}`);
          requestHeaders['Authorization'] = `Basic ${auth}`;
        }
      }
    }

    // Headers customizados
    for (const header of (headers as Array<{ key: string; value: string }>) || []) {
      if (header.key) {
        requestHeaders[header.key] = header.value;
      }
    }

    // Fazer request
    const response = await axios({
      method: method as string,
      url: finalUrl,
      headers: requestHeaders,
      data: bodyData?.raw || bodyData?.json,
    });

    // Salvar variáveis da resposta
    for (const variable of (variables as Array<{ key: string; value: string }>) || []) {
      if (variable.key && variable.value) {
        const value = getNestedValue(response.data, variable.value);
        context.setVariable(variable.key, value);
      }
    }

    return {
      success: true,
      output: {
        statusCode: response.status,
        body: response.data,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Helper para acessar valores aninhados (body.data.user.name)
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}
```

**Exemplo: sendMessageExecutor.ts**
```typescript
export const sendMessageExecutor: NodeExecutor = async (nodeData, context) => {
  const { messageType, text, mediaUrl, buttons, credentialId } = nodeData;

  try {
    const credential = context.getCredential(credentialId as string);
    if (!credential) {
      return { success: false, error: 'WhatsApp credential not configured' };
    }

    const { apiUrl, accessToken, phoneNumberId } = credential;
    const recipientPhone = context.input.contact?.phone;

    if (!recipientPhone) {
      return { success: false, error: 'No recipient phone number' };
    }

    // Substituir variáveis no texto
    let finalText = text as string;
    for (const [key, value] of Object.entries(context.input.variables)) {
      finalText = finalText.replace(`{{{${key}}}}`, String(value));
    }

    // Enviar via WhatsApp API
    const response = await axios.post(
      `${apiUrl}/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: recipientPhone,
        type: messageType || 'text',
        text: { body: finalText },
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      output: {
        messageId: response.data.messages?.[0]?.id,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
```

### 4.3 Flow Execution Engine

```
src/services/flow/flowEngine.ts
```

```typescript
import { FlowNode, FlowEdge } from '@/types/api';
import { credentialsService } from '../credentials/credentialsService';
import { nodeExecutors } from './nodeExecutors';

export class FlowEngine {
  private nodes: FlowNode[];
  private edges: FlowEdge[];
  private variables: Record<string, unknown> = {};
  private logs: string[] = [];

  constructor(nodes: FlowNode[], edges: FlowEdge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  async execute(input: { message?: string; contact?: IContact }): Promise<void> {
    // Encontrar node inicial (trigger)
    const startNode = this.nodes.find(n =>
      n.type?.startsWith('TRIGGER_') || n.type === 'INITIAL'
    );

    if (!startNode) {
      throw new Error('No start node found');
    }

    let currentNodeId = startNode.id;

    while (currentNodeId) {
      const node = this.nodes.find(n => n.id === currentNodeId);
      if (!node) break;

      this.log(`Executing node: ${node.type} (${node.id})`);

      // Executar node
      const executor = nodeExecutors[node.type as string];
      if (executor) {
        const result = await executor(node.data, {
          input: {
            ...input,
            variables: this.variables,
          },
          getCredential: (id) => credentialsService.decrypt(id),
          setVariable: (key, value) => {
            this.variables[key] = value;
          },
          log: (msg) => this.log(msg),
        });

        if (!result.success) {
          this.log(`Error: ${result.error}`);
          break;
        }

        // Determinar próximo node
        if (result.nextNodeId) {
          // Condição especificou próximo node
          currentNodeId = result.nextNodeId;
        } else {
          // Seguir edge padrão
          const edge = this.edges.find(e => e.source === currentNodeId);
          currentNodeId = edge?.target || '';
        }
      } else {
        // Node sem executor, pular para próximo
        const edge = this.edges.find(e => e.source === currentNodeId);
        currentNodeId = edge?.target || '';
      }
    }

    this.log('Flow execution completed');
  }

  private log(message: string) {
    const timestamp = new Date().toISOString();
    this.logs.push(`[${timestamp}] ${message}`);
    console.log(`[FlowEngine] ${message}`);
  }

  getLogs(): string[] {
    return this.logs;
  }

  getVariables(): Record<string, unknown> {
    return this.variables;
  }
}
```

---

## Fase 5: Integração com Backend (WhatsCRM)

### 5.1 Mapear tipos para o formato do WhatsCRM

O backend WhatsCRM espera nodes em formato específico. Criar adaptador:

```typescript
// src/services/flow/whatscrm/adapter.ts

export function convertToWhatsCRMFormat(nodes: FlowNode[], edges: FlowEdge[]) {
  return nodes.map(node => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: {
      ...node.data,
      // Resolver credentials para dados reais antes de enviar
      _credentials: node.data.credentialId
        ? credentialsService.decrypt(node.data.credentialId)
        : undefined,
    },
  }));
}
```

---

## Resumo das Tarefas

### Sprint 1: Credentials (3-4 dias)
- [ ] Criar tipos de credentials
- [ ] Implementar credentialsService
- [ ] Criar store Zustand
- [ ] Definir credentials (WhatsApp, OpenAI, HTTP, MySQL)
- [ ] Implementar Tab Credentials na FlowsList
- [ ] Modal criar/editar credential
- [ ] Teste de conexão

### Sprint 2: Integração nos Nodes (2-3 dias)
- [ ] Criar CredentialSelector component
- [ ] Atualizar MakeRequestConfig
- [ ] Atualizar AITransferConfig
- [ ] Atualizar DatabaseQueryConfig
- [ ] Atualizar SendMessageConfig (WhatsApp credential)

### Sprint 3: Engine de Execução (4-5 dias)
- [ ] Criar interface de execução
- [ ] Implementar makeRequestExecutor
- [ ] Implementar sendMessageExecutor
- [ ] Implementar conditionExecutor
- [ ] Implementar delayExecutor
- [ ] Implementar aiTransferExecutor
- [ ] Criar FlowEngine
- [ ] Botão "Test Flow" no editor

### Sprint 4: Integração Backend (2-3 dias)
- [ ] Adaptar formato para WhatsCRM
- [ ] Sincronizar credentials com backend
- [ ] Integrar execução real

---

## Ordem de Implementação Sugerida

1. **Primeiro**: Sistema de Credentials (é base para tudo)
2. **Segundo**: CredentialSelector nos configs existentes
3. **Terceiro**: Executors dos nodes mais importantes (HTTP, SendMessage)
4. **Quarto**: FlowEngine para testes
5. **Quinto**: Integração com backend

Quer que eu comece implementando a **Fase 1 (Sistema de Credentials)**?
