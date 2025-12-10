import { ICredentialTypeDefinition } from '@/types/credentials';

export const httpBearerCredential: ICredentialTypeDefinition = {
  name: 'http_bearer',
  displayName: 'HTTP Bearer Token',
  icon: 'Key',
  description: 'Autenticação HTTP com Bearer Token',
  category: 'http',

  properties: [
    {
      name: 'token',
      displayName: 'Token',
      type: 'password',
      required: true,
      placeholder: 'seu_token_aqui',
      description: 'Token de autenticação (será enviado como "Authorization: Bearer token")',
    },
    {
      name: 'headerName',
      displayName: 'Nome do Header',
      type: 'string',
      required: false,
      default: 'Authorization',
      placeholder: 'Authorization',
      description: 'Nome do header de autenticação (padrão: Authorization)',
    },
    {
      name: 'tokenPrefix',
      displayName: 'Prefixo do Token',
      type: 'string',
      required: false,
      default: 'Bearer',
      placeholder: 'Bearer',
      description: 'Prefixo antes do token (padrão: Bearer)',
    },
  ],
};
