import { ICredentialTypeDefinition } from '@/types/credentials';

export const httpApiKeyCredential: ICredentialTypeDefinition = {
  name: 'http_api_key',
  displayName: 'HTTP API Key',
  icon: 'KeyRound',
  description: 'Autenticação HTTP com API Key em header ou query parameter',
  category: 'http',

  properties: [
    {
      name: 'apiKey',
      displayName: 'API Key',
      type: 'password',
      required: true,
      placeholder: 'sua_api_key',
      description: 'Sua chave de API',
    },
    {
      name: 'sendAs',
      displayName: 'Enviar Como',
      type: 'options',
      required: true,
      default: 'header',
      options: [
        { name: 'Header', value: 'header' },
        { name: 'Query Parameter', value: 'query' },
      ],
      description: 'Como a API Key deve ser enviada',
    },
    {
      name: 'parameterName',
      displayName: 'Nome do Parâmetro',
      type: 'string',
      required: true,
      default: 'X-API-Key',
      placeholder: 'X-API-Key',
      description: 'Nome do header ou query parameter',
    },
  ],
};
