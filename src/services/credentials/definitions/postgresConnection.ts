import { ICredentialTypeDefinition } from '@/types/credentials';

export const postgresConnectionCredential: ICredentialTypeDefinition = {
  name: 'postgres_connection',
  displayName: 'PostgreSQL',
  icon: 'Database',
  description: 'Conexão com banco de dados PostgreSQL',
  category: 'database',

  properties: [
    {
      name: 'host',
      displayName: 'Host',
      type: 'string',
      required: true,
      default: 'localhost',
      placeholder: 'localhost',
      description: 'Endereço do servidor PostgreSQL',
    },
    {
      name: 'port',
      displayName: 'Porta',
      type: 'number',
      required: true,
      default: 5432,
      placeholder: '5432',
      description: 'Porta do servidor PostgreSQL',
    },
    {
      name: 'database',
      displayName: 'Banco de Dados',
      type: 'string',
      required: true,
      placeholder: 'meu_banco',
      description: 'Nome do banco de dados',
    },
    {
      name: 'user',
      displayName: 'Usuário',
      type: 'string',
      required: true,
      placeholder: 'postgres',
      description: 'Usuário do banco de dados',
    },
    {
      name: 'password',
      displayName: 'Senha',
      type: 'password',
      required: true,
      placeholder: '********',
      description: 'Senha do banco de dados',
    },
    {
      name: 'ssl',
      displayName: 'Modo SSL',
      type: 'options',
      required: false,
      default: 'disable',
      options: [
        { name: 'Desabilitado', value: 'disable' },
        { name: 'Permitir', value: 'allow' },
        { name: 'Preferir', value: 'prefer' },
        { name: 'Requerer', value: 'require' },
      ],
      description: 'Modo de conexão SSL',
    },
  ],
};
