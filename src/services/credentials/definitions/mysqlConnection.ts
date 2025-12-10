import { ICredentialTypeDefinition } from '@/types/credentials';

export const mysqlConnectionCredential: ICredentialTypeDefinition = {
  name: 'mysql_connection',
  displayName: 'MySQL',
  icon: 'Database',
  description: 'Conexão com banco de dados MySQL',
  category: 'database',

  properties: [
    {
      name: 'host',
      displayName: 'Host',
      type: 'string',
      required: true,
      default: 'localhost',
      placeholder: 'localhost',
      description: 'Endereço do servidor MySQL',
    },
    {
      name: 'port',
      displayName: 'Porta',
      type: 'number',
      required: true,
      default: 3306,
      placeholder: '3306',
      description: 'Porta do servidor MySQL',
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
      placeholder: 'root',
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
      displayName: 'Usar SSL',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Usar conexão SSL/TLS',
    },
  ],
};
