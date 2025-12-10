import { ICredentialTypeDefinition, CredentialType } from '@/types/credentials';

// Import all credential definitions
import { whatsappApiCredential } from './whatsappApi';
import { openaiApiCredential } from './openaiApi';
import { httpBasicCredential } from './httpBasic';
import { httpBearerCredential } from './httpBearer';
import { httpApiKeyCredential } from './httpApiKey';
import { mysqlConnectionCredential } from './mysqlConnection';
import { postgresConnectionCredential } from './postgresConnection';
import { webhookSecretCredential } from './webhookSecret';

// Export individual credentials
export {
  whatsappApiCredential,
  openaiApiCredential,
  httpBasicCredential,
  httpBearerCredential,
  httpApiKeyCredential,
  mysqlConnectionCredential,
  postgresConnectionCredential,
  webhookSecretCredential,
};

// Map of all credential definitions
export const credentialDefinitions: Record<CredentialType, ICredentialTypeDefinition> = {
  whatsapp_api: whatsappApiCredential,
  openai_api: openaiApiCredential,
  http_basic: httpBasicCredential,
  http_bearer: httpBearerCredential,
  http_api_key: httpApiKeyCredential,
  mysql_connection: mysqlConnectionCredential,
  postgres_connection: postgresConnectionCredential,
  webhook_secret: webhookSecretCredential,
  google_sheets: {
    name: 'google_sheets',
    displayName: 'Google Sheets',
    icon: 'Sheet',
    description: 'Conexão com Google Sheets (OAuth2)',
    category: 'integrations',
    properties: [
      {
        name: 'oauthToken',
        displayName: 'OAuth Token',
        type: 'password',
        required: true,
        description: 'Token OAuth2 do Google',
      },
    ],
  },
};

// Get all credential definitions as array
export const getAllCredentialDefinitions = (): ICredentialTypeDefinition[] => {
  return Object.values(credentialDefinitions);
};

// Get credential definition by type
export const getCredentialDefinition = (type: CredentialType): ICredentialTypeDefinition | undefined => {
  return credentialDefinitions[type];
};

// Get credential definitions by category
export const getCredentialsByCategory = (category: ICredentialTypeDefinition['category']): ICredentialTypeDefinition[] => {
  return getAllCredentialDefinitions().filter(def => def.category === category);
};

// Get all categories
export const getCredentialCategories = (): Array<{ name: string; value: ICredentialTypeDefinition['category'] }> => {
  return [
    { name: 'Mensagens', value: 'messaging' },
    { name: 'Inteligência Artificial', value: 'ai' },
    { name: 'HTTP / APIs', value: 'http' },
    { name: 'Banco de Dados', value: 'database' },
    { name: 'Integrações', value: 'integrations' },
  ];
};
