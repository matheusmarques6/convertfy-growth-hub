import { ICredentialTypeDefinition } from '@/types/credentials';

export const httpBasicCredential: ICredentialTypeDefinition = {
  name: 'http_basic',
  displayName: 'HTTP Basic Auth',
  icon: 'Lock',
  description: 'Autenticação HTTP básica com usuário e senha',
  category: 'http',

  properties: [
    {
      name: 'username',
      displayName: 'Usuário',
      type: 'string',
      required: true,
      placeholder: 'seu_usuario',
      description: 'Nome de usuário para autenticação',
    },
    {
      name: 'password',
      displayName: 'Senha',
      type: 'password',
      required: true,
      placeholder: '********',
      description: 'Senha para autenticação',
    },
  ],
};
