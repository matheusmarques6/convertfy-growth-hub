import { ICredentialTypeDefinition } from '@/types/credentials';

export const openaiApiCredential: ICredentialTypeDefinition = {
  name: 'openai_api',
  displayName: 'OpenAI API',
  icon: 'Brain',
  description: 'Conecte-se à API da OpenAI para usar modelos GPT, DALL-E e mais',
  category: 'ai',
  documentationUrl: 'https://platform.openai.com/docs/api-reference',

  properties: [
    {
      name: 'apiKey',
      displayName: 'API Key',
      type: 'password',
      required: true,
      placeholder: 'sk-...',
      description: 'Sua chave de API da OpenAI',
    },
    {
      name: 'organization',
      displayName: 'ID da Organização',
      type: 'string',
      required: false,
      placeholder: 'org-...',
      description: 'ID da organização (opcional, para contas enterprise)',
    },
    {
      name: 'baseUrl',
      displayName: 'URL Base',
      type: 'string',
      required: false,
      default: 'https://api.openai.com/v1',
      placeholder: 'https://api.openai.com/v1',
      description: 'URL base da API (altere para usar proxies ou APIs compatíveis)',
    },
    {
      name: 'defaultModel',
      displayName: 'Modelo Padrão',
      type: 'options',
      required: false,
      default: 'gpt-4o',
      options: [
        { name: 'GPT-4o', value: 'gpt-4o' },
        { name: 'GPT-4o Mini', value: 'gpt-4o-mini' },
        { name: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
        { name: 'GPT-4', value: 'gpt-4' },
        { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
      ],
      description: 'Modelo padrão a ser usado quando não especificado',
    },
  ],

  test: {
    request: {
      url: '{{baseUrl}}/models',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer {{apiKey}}',
      },
    },
  },
};
