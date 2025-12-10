# Arquitetura N8N - Análise Completa

> Documentação detalhada sobre como o N8N estrutura integrações, credentials e o sistema de nodes.

---

## 1. Estrutura do Repositório

```
n8n/
├── packages/
│   ├── nodes-base/              # Pacote principal de integrações
│   │   ├── nodes/               # 300+ integrações (Slack, HTTP, Google, etc)
│   │   ├── credentials/         # Definições de autenticação
│   │   └── utils/               # Funções utilitárias compartilhadas
│   │
│   ├── workflow/                # Core - Types e Interfaces
│   │   └── src/
│   │       ├── interfaces.ts    # INodeType, ICredentialType, etc
│   │       └── workflow.ts      # Lógica de execução
│   │
│   ├── frontend/editor-ui/      # Interface Vue.js
│   │   └── src/
│   │       ├── features/
│   │       │   └── credentials/ # Store e API de credentials
│   │       └── components/      # Componentes do editor
│   │
│   ├── core/                    # Engine de execução
│   └── cli/                     # Servidor backend Node.js
```

---

## 2. Anatomia de um Node (Integração)

### 2.1 Estrutura de Pastas

Cada integração segue este padrão:

```
nodes/Slack/
├── Slack.node.ts           # Entry point (versioned)
├── Slack.node.json         # Metadata (categorias, docs, alias)
├── slack.svg               # Ícone da integração
├── V1/
│   └── SlackV1.node.ts     # Implementação versão 1
├── V2/
│   ├── SlackV2.node.ts     # Implementação versão 2
│   ├── GenericFunctions.ts # Helpers para API calls
│   ├── ChannelDescription.ts
│   ├── MessageDescription.ts
│   └── UserDescription.ts
└── test/                   # Testes automatizados
```

### 2.2 Interface INodeType

```typescript
export interface INodeType {
  description: INodeTypeDescription;

  // Método principal de execução
  execute?(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;

  // Para triggers (webhooks, polling)
  trigger?(this: ITriggerFunctions): Promise<ITriggerResponse>;
  webhook?(this: IWebhookFunctions): Promise<IWebhookResponseData>;
  poll?(this: IPollFunctions): Promise<INodeExecutionData[][]>;

  // Métodos auxiliares
  methods?: {
    loadOptions?: {
      [key: string]: (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>;
    };
    listSearch?: {
      [key: string]: (this: ILoadOptionsFunctions, filter?: string) => Promise<INodeListSearchResult>;
    };
  };
}
```

### 2.3 Interface INodeTypeDescription

```typescript
export interface INodeTypeDescription {
  // Identificação
  displayName: string;           // Nome exibido: "Slack"
  name: string;                  // ID interno: "slack"
  icon: string;                  // "file:slack.svg"
  group: string[];               // ['output'] ou ['transform']
  version: number | number[];    // [1, 2, 2.1, 2.2]

  // Descrição
  subtitle?: string;             // '={{$parameter["operation"]}}'
  description: string;           // Descrição para o usuário

  // Conexões
  inputs: NodeConnectionType[];  // [NodeConnectionTypes.Main]
  outputs: NodeConnectionType[]; // [NodeConnectionTypes.Main]

  // Defaults
  defaults: {
    name: string;                // Nome padrão ao adicionar
    color?: string;
  };

  // Credentials
  credentials?: INodeCredentialDescription[];

  // Propriedades (campos do formulário)
  properties: INodeProperties[];

  // Opções avançadas
  usableAsTool?: boolean;        // Pode ser usado como tool de AI
  polling?: boolean;             // É um trigger de polling
  webhooks?: IWebhookDescription[];
}
```

### 2.4 Exemplo Completo: Slack Node

```typescript
// Slack.node.ts - Entry Point
import { VersionedNodeType } from 'n8n-workflow';
import { SlackV1 } from './V1/SlackV1.node';
import { SlackV2 } from './V2/SlackV2.node';

export class Slack extends VersionedNodeType {
  constructor() {
    const baseDescription = {
      displayName: 'Slack',
      name: 'slack',
      icon: 'file:slack.svg',
      group: ['output'],
      subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
      description: 'Consume Slack API',
      defaultVersion: 2.4,
    };

    const nodeVersions = {
      1: new SlackV1(baseDescription),
      2: new SlackV2(baseDescription),
      2.1: new SlackV2(baseDescription),
      2.2: new SlackV2(baseDescription),
    };

    super(nodeVersions, baseDescription);
  }
}
```

```typescript
// V2/SlackV2.node.ts - Implementação
export class SlackV2 implements INodeType {
  description: INodeTypeDescription;

  constructor(baseDescription: INodeTypeBaseDescription) {
    this.description = {
      ...baseDescription,
      version: [2, 2.1, 2.2],
      defaults: { name: 'Slack' },
      inputs: [NodeConnectionTypes.Main],
      outputs: [NodeConnectionTypes.Main],

      // CREDENTIALS SUPORTADAS
      credentials: [
        {
          name: 'slackApi',
          required: true,
          displayOptions: {
            show: { authentication: ['accessToken'] },
          },
        },
        {
          name: 'slackOAuth2Api',
          required: true,
          displayOptions: {
            show: { authentication: ['oAuth2'] },
          },
        },
      ],

      // PROPRIEDADES
      properties: [
        // Tipo de autenticação
        {
          displayName: 'Authentication',
          name: 'authentication',
          type: 'options',
          options: [
            { name: 'Access Token', value: 'accessToken' },
            { name: 'OAuth2', value: 'oAuth2' },
          ],
          default: 'accessToken',
        },
        // Recurso
        {
          displayName: 'Resource',
          name: 'resource',
          type: 'options',
          noDataExpression: true,
          options: [
            { name: 'Channel', value: 'channel' },
            { name: 'Message', value: 'message' },
            { name: 'User', value: 'user' },
          ],
          default: 'message',
        },
        // Operações importadas de outros arquivos
        ...messageOperations,
        ...messageFields,
        ...channelOperations,
        ...channelFields,
      ],
    };
  }

  // MÉTODOS DE CARREGAMENTO DINÂMICO
  methods = {
    loadOptions: {
      async getChannels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const channels = await slackApiRequestAllItems.call(
          this, 'channels', 'GET', '/conversations.list'
        );
        return channels.map(c => ({
          name: c.name,
          value: c.id,
        }));
      },

      async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const users = await slackApiRequestAllItems.call(
          this, 'members', 'GET', '/users.list'
        );
        return users.map(u => ({
          name: u.name,
          value: u.id,
        }));
      },
    },
  };

  // EXECUÇÃO PRINCIPAL
  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);

    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === 'message') {
          if (operation === 'post') {
            const channel = this.getNodeParameter('channelId', i, {}, { extractValue: true });
            const text = this.getNodeParameter('text', i);

            const body = { channel, text };
            const response = await slackApiRequest.call(this, 'POST', '/chat.postMessage', body);

            returnData.push({ json: response });
          }

          if (operation === 'delete') {
            const channel = this.getNodeParameter('channelId', i, {}, { extractValue: true });
            const ts = this.getNodeParameter('timestamp', i);

            const body = { channel, ts };
            await slackApiRequest.call(this, 'POST', '/chat.delete', body);

            returnData.push({ json: { success: true } });
          }
        }

        if (resource === 'channel') {
          if (operation === 'getAll') {
            const returnAll = this.getNodeParameter('returnAll', i);

            if (returnAll) {
              const channels = await slackApiRequestAllItems.call(
                this, 'channels', 'GET', '/conversations.list'
              );
              returnData.push(...channels.map(c => ({ json: c })));
            } else {
              const limit = this.getNodeParameter('limit', i);
              const response = await slackApiRequest.call(
                this, 'GET', '/conversations.list', {}, { limit }
              );
              returnData.push(...response.channels.map(c => ({ json: c })));
            }
          }
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
```

---

## 3. Sistema de Credentials

### 3.1 Interface ICredentialType

```typescript
export interface ICredentialType {
  // Identificação
  name: string;                  // 'slackApi'
  displayName: string;           // 'Slack API'

  // Visual
  icon?: string;
  documentationUrl?: string;

  // Herança (para OAuth2, etc)
  extends?: string[];            // ['oAuth2Api']

  // Campos do formulário
  properties: INodeProperties[];

  // Como autenticar requests
  authenticate?: IAuthenticate;

  // Teste de conexão
  test?: ICredentialTestRequest;

  // Pre-processamento
  preAuthentication?: (credentials: ICredentialDataDecryptedObject) => Promise<IDataObject>;
}
```

### 3.2 Credential Simples (API Token)

```typescript
// credentials/SlackApi.credentials.ts
export class SlackApi implements ICredentialType {
  name = 'slackApi';
  displayName = 'Slack API';
  documentationUrl = 'slack';

  properties: INodeProperties[] = [
    {
      displayName: 'Access Token',
      name: 'accessToken',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
    {
      displayName: 'Signature Secret',
      name: 'signatureSecret',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: 'Used to verify webhook authenticity',
    },
  ];

  // COMO INJETAR AUTENTICAÇÃO NOS REQUESTS
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.accessToken}}',
      },
    },
  };

  // TESTE DE CONEXÃO
  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://slack.com',
      url: '/api/users.profile.get',
    },
    rules: [
      {
        type: 'responseSuccessBody',
        properties: {
          key: 'error',
          value: 'invalid_auth',
          message: 'Invalid access token',
        },
      },
    ],
  };
}
```

### 3.3 Credential OAuth2

```typescript
// credentials/SlackOAuth2Api.credentials.ts
const userScopes = [
  'channels:read',
  'channels:write',
  'chat:write',
  'users:read',
];

export class SlackOAuth2Api implements ICredentialType {
  name = 'slackOAuth2Api';
  extends = ['oAuth2Api'];  // HERDA CONFIG BASE
  displayName = 'Slack OAuth2 API';
  documentationUrl = 'slack';

  properties: INodeProperties[] = [
    {
      displayName: 'Grant Type',
      name: 'grantType',
      type: 'hidden',
      default: 'authorizationCode',
    },
    {
      displayName: 'Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default: 'https://slack.com/oauth/v2/authorize',
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default: 'https://slack.com/api/oauth.v2.access',
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'hidden',
      default: 'chat:write',
    },
    {
      displayName: 'Auth URI Query Parameters',
      name: 'authQueryParameters',
      type: 'hidden',
      default: `user_scope=${userScopes.join(' ')}`,
    },
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'body',
    },
  ];
}
```

### 3.4 Credential com Basic Auth

```typescript
export class HttpBasicAuth implements ICredentialType {
  name = 'httpBasicAuth';
  displayName = 'Basic Auth';

  properties: INodeProperties[] = [
    {
      displayName: 'User',
      name: 'user',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      auth: {
        username: '={{$credentials.user}}',
        password: '={{$credentials.password}}',
      },
    },
  };
}
```

---

## 4. Tipos de Propriedades (Campos)

### 4.1 Tipos Disponíveis

| Tipo | Descrição | Uso |
|------|-----------|-----|
| `string` | Campo de texto | Inputs simples |
| `number` | Campo numérico | Valores numéricos |
| `boolean` | Checkbox | Flags on/off |
| `options` | Select/Dropdown | Escolha única |
| `multiOptions` | Multi-select | Escolha múltipla |
| `collection` | Grupo de campos opcionais | "Additional Options" |
| `fixedCollection` | Grupo fixo de campos | Arrays de objetos |
| `json` | Editor JSON | Dados complexos |
| `dateTime` | Date picker | Datas |
| `color` | Color picker | Cores |
| `resourceLocator` | Busca dinâmica | Selecionar recursos |
| `notice` | Texto informativo | Avisos ao usuário |
| `hidden` | Campo oculto | Valores internos |

### 4.2 Exemplos de Cada Tipo

```typescript
const properties: INodeProperties[] = [
  // STRING
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    placeholder: 'Enter name...',
    description: 'The name of the resource',
    required: true,
  },

  // OPTIONS (Select)
  {
    displayName: 'Method',
    name: 'method',
    type: 'options',
    options: [
      { name: 'GET', value: 'GET' },
      { name: 'POST', value: 'POST' },
      { name: 'PUT', value: 'PUT' },
      { name: 'DELETE', value: 'DELETE' },
    ],
    default: 'GET',
  },

  // RESOURCE LOCATOR (Busca Dinâmica)
  {
    displayName: 'Channel',
    name: 'channelId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        placeholder: 'Select a channel...',
        typeOptions: {
          searchListMethod: 'getChannels',  // Chama methods.loadOptions.getChannels
          searchable: true,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'C1234567890',
        validation: [
          {
            type: 'regex',
            properties: {
              regex: '^[A-Z0-9]+$',
              errorMessage: 'Invalid channel ID',
            },
          },
        ],
      },
      {
        displayName: 'By Name',
        name: 'name',
        type: 'string',
        placeholder: '#general',
      },
    ],
  },

  // COLLECTION (Campos Opcionais)
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    options: [
      {
        displayName: 'Thread ID',
        name: 'thread_ts',
        type: 'string',
        default: '',
        description: 'Reply to a specific thread',
      },
      {
        displayName: 'As User',
        name: 'as_user',
        type: 'boolean',
        default: false,
      },
    ],
  },

  // FIXED COLLECTION (Array de Objetos)
  {
    displayName: 'Headers',
    name: 'headers',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    default: {},
    options: [
      {
        name: 'header',
        displayName: 'Header',
        values: [
          {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
          },
        ],
      },
    ],
  },

  // JSON
  {
    displayName: 'Body',
    name: 'body',
    type: 'json',
    default: '{}',
    displayOptions: {
      show: {
        method: ['POST', 'PUT', 'PATCH'],
      },
    },
  },

  // CONDICIONAL (displayOptions)
  {
    displayName: 'Query Parameters',
    name: 'queryParams',
    type: 'fixedCollection',
    displayOptions: {
      show: {
        method: ['GET'],
      },
      hide: {
        resource: ['webhook'],
      },
    },
    // ...
  },
];
```

---

## 5. Padrão de API Request

### 5.1 GenericFunctions.ts

```typescript
// GenericFunctions.ts
import { IExecuteFunctions, IDataObject, IRequestOptions } from 'n8n-workflow';

const BASE_URL = 'https://slack.com/api';

export async function slackApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: string,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  headers: IDataObject = {},
): Promise<any> {
  const authType = this.getNodeParameter('authentication', 0) as string;

  const options: IRequestOptions = {
    method,
    body,
    qs: query,
    uri: `${BASE_URL}${endpoint}`,
    headers,
    json: true,
  };

  // Remove body vazio para GET requests
  if (method === 'GET') {
    delete options.body;
  }

  try {
    // requestWithAuthentication injeta automaticamente as credentials
    const credentialType = authType === 'oAuth2' ? 'slackOAuth2Api' : 'slackApi';
    const response = await this.helpers.requestWithAuthentication.call(
      this,
      credentialType,
      options,
    );

    // Slack retorna { ok: false, error: '...' } em caso de erro
    if (response.ok === false) {
      throw new NodeApiError(this.getNode(), response, {
        message: response.error,
      });
    }

    return response;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error);
  }
}

// PAGINAÇÃO AUTOMÁTICA
export async function slackApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  propertyName: string,
  method: string,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
): Promise<any[]> {
  const returnData: any[] = [];
  let cursor: string | undefined;

  do {
    const response = await slackApiRequest.call(
      this,
      method,
      endpoint,
      body,
      { ...query, cursor, limit: 200 },
    );

    returnData.push(...(response[propertyName] || []));
    cursor = response.response_metadata?.next_cursor;
  } while (cursor);

  return returnData;
}
```

---

## 6. Frontend - Gerenciamento de Credentials

### 6.1 Store (Pinia)

```typescript
// credentials.store.ts
export const useCredentialsStore = defineStore('credentials', () => {
  const credentials = ref<Record<string, ICredentialsResponse>>({});
  const credentialTypes = ref<Record<string, ICredentialType>>({});

  // Computed
  const allCredentials = computed(() => Object.values(credentials.value));
  const allCredentialTypes = computed(() => Object.values(credentialTypes.value));

  const getCredentialsByType = computed(() => (type: string) => {
    return allCredentials.value.filter(c => c.type === type);
  });

  // Actions
  async function fetchCredentialTypes() {
    const types = await credentialsApi.getCredentialTypes();
    types.forEach(type => {
      credentialTypes.value[type.name] = type;
    });
  }

  async function fetchAllCredentials() {
    const creds = await credentialsApi.getAllCredentials();
    creds.forEach(cred => {
      credentials.value[cred.id] = cred;
    });
  }

  async function createCredential(data: ICredentialsDecrypted) {
    const response = await credentialsApi.createCredential(data);
    credentials.value[response.id] = response;
    return response;
  }

  async function updateCredential(id: string, data: Partial<ICredentialsDecrypted>) {
    const response = await credentialsApi.updateCredential(id, data);
    credentials.value[id] = response;
    return response;
  }

  async function deleteCredential(id: string) {
    await credentialsApi.deleteCredential(id);
    delete credentials.value[id];
  }

  async function testCredential(
    credentialType: string,
    data: ICredentialDataDecryptedObject
  ): Promise<INodeCredentialTestResult> {
    return credentialsApi.testCredential(credentialType, data);
  }

  return {
    credentials,
    credentialTypes,
    allCredentials,
    allCredentialTypes,
    getCredentialsByType,
    fetchCredentialTypes,
    fetchAllCredentials,
    createCredential,
    updateCredential,
    deleteCredential,
    testCredential,
  };
});
```

### 6.2 API

```typescript
// credentials.api.ts
import { makeRestApiRequest } from '@/utils/apiUtils';

export async function getCredentialTypes(): Promise<ICredentialType[]> {
  return makeRestApiRequest('GET', '/credential-types');
}

export async function getAllCredentials(): Promise<ICredentialsResponse[]> {
  return makeRestApiRequest('GET', '/credentials');
}

export async function getCredentialById(id: string): Promise<ICredentialsDecryptedResponse> {
  return makeRestApiRequest('GET', `/credentials/${id}`);
}

export async function createCredential(data: ICredentialsDecrypted): Promise<ICredentialsResponse> {
  return makeRestApiRequest('POST', '/credentials', data);
}

export async function updateCredential(
  id: string,
  data: Partial<ICredentialsDecrypted>
): Promise<ICredentialsResponse> {
  return makeRestApiRequest('PATCH', `/credentials/${id}`, data);
}

export async function deleteCredential(id: string): Promise<void> {
  return makeRestApiRequest('DELETE', `/credentials/${id}`);
}

export async function testCredential(
  credentialType: string,
  data: ICredentialDataDecryptedObject
): Promise<INodeCredentialTestResult> {
  return makeRestApiRequest('POST', '/credentials/test', {
    credentials: { type: credentialType, data },
  });
}
```

---

## 7. Como Criar uma Nova Integração

### Checklist

1. **Criar estrutura de pastas**
   ```
   nodes-base/nodes/MinhaIntegracao/
   ├── MinhaIntegracao.node.ts
   ├── MinhaIntegracao.node.json
   ├── minhaIntegracao.svg
   └── GenericFunctions.ts
   ```

2. **Criar credential**
   ```
   nodes-base/credentials/MinhaIntegracaoApi.credentials.ts
   ```

3. **Registrar no package.json**
   ```json
   {
     "n8n": {
       "nodes": ["dist/nodes/MinhaIntegracao/MinhaIntegracao.node.js"],
       "credentials": ["dist/credentials/MinhaIntegracaoApi.credentials.js"]
     }
   }
   ```

4. **Implementar o node**
   - Definir `description` com properties
   - Implementar `execute()` ou `trigger()`
   - Adicionar `methods.loadOptions` se necessário

5. **Testar**
   - Testar autenticação
   - Testar cada operação
   - Verificar tratamento de erros

---

## 8. Aplicação no Convertfy

### O que podemos implementar:

1. **Sistema de Credentials** similar ao N8N
   - Store centralizado para credentials
   - Formulário dinâmico baseado em `properties`
   - Teste de conexão

2. **Nodes com Interface Declarativa**
   - Definir nodes como objetos com `properties`
   - Renderização automática de formulários
   - Validação baseada em schema

3. **Integrações Modulares**
   - Cada integração em pasta separada
   - GenericFunctions para API calls
   - Reutilização de padrões

### Próximos Passos Sugeridos:

1. Criar sistema de credentials no Convertfy
2. Implementar renderização dinâmica de properties
3. Criar nodes de integração (WhatsApp, HTTP, etc)
4. Adicionar teste de conexão para credentials
