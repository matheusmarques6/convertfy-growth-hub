import { ICredentialTypeDefinition } from '@/types/credentials';

export const webhookSecretCredential: ICredentialTypeDefinition = {
  name: 'webhook_secret',
  displayName: 'Webhook Secret',
  icon: 'Webhook',
  description: 'Secret para validação de webhooks recebidos',
  category: 'http',

  properties: [
    {
      name: 'secret',
      displayName: 'Secret',
      type: 'password',
      required: true,
      placeholder: 'seu_secret_aqui',
      description: 'Secret compartilhado para validar assinaturas de webhook',
    },
    {
      name: 'headerName',
      displayName: 'Header de Assinatura',
      type: 'string',
      required: false,
      default: 'X-Hub-Signature-256',
      placeholder: 'X-Hub-Signature-256',
      description: 'Nome do header que contém a assinatura',
    },
    {
      name: 'algorithm',
      displayName: 'Algoritmo',
      type: 'options',
      required: false,
      default: 'sha256',
      options: [
        { name: 'SHA-256', value: 'sha256' },
        { name: 'SHA-1', value: 'sha1' },
        { name: 'MD5', value: 'md5' },
      ],
      description: 'Algoritmo usado para gerar a assinatura',
    },
  ],
};
