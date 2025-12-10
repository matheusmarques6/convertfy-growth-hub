// Tipos de Credentials
export type CredentialType =
  | 'whatsapp_api'      // API do WhatsApp Business
  | 'openai_api'        // OpenAI para IA
  | 'http_basic'        // Basic Auth
  | 'http_bearer'       // Bearer Token
  | 'http_api_key'      // API Key Header
  | 'mysql_connection'  // MySQL Database
  | 'postgres_connection' // PostgreSQL Database
  | 'google_sheets'     // Google Sheets OAuth
  | 'webhook_secret';   // Webhook com secret

// Interface de definição de credential (inspirado no N8N)
export interface ICredentialTypeDefinition {
  name: CredentialType;
  displayName: string;
  icon: string;
  description: string;
  documentationUrl?: string;
  category: 'messaging' | 'ai' | 'http' | 'database' | 'integrations';

  // Campos do formulário
  properties: ICredentialProperty[];

  // Teste de conexão
  test?: {
    request: {
      url: string;
      method: 'GET' | 'POST';
      headers?: Record<string, string>;
    };
  };
}

export interface ICredentialProperty {
  name: string;
  displayName: string;
  type: 'string' | 'password' | 'number' | 'options' | 'boolean' | 'json';
  default?: unknown;
  required?: boolean;
  placeholder?: string;
  description?: string;
  options?: { name: string; value: string }[];
  // Mostrar apenas se outra propriedade tiver determinado valor
  displayOptions?: {
    show?: Record<string, unknown[]>;
    hide?: Record<string, unknown[]>;
  };
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
  [key: string]: string | number | boolean | null | undefined;
}

// Estado de teste de conexão
export interface ICredentialTestResult {
  success: boolean;
  message: string;
  testedAt?: string;
}
