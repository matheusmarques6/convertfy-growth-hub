import { ICredentialTypeDefinition } from '@/types/credentials';

export const whatsappApiCredential: ICredentialTypeDefinition = {
  name: 'whatsapp_api',
  displayName: 'WhatsApp Business API',
  icon: 'MessageCircle',
  description: 'Conecte-se à API do WhatsApp Business para enviar e receber mensagens',
  category: 'messaging',
  documentationUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api',

  properties: [
    {
      name: 'apiUrl',
      displayName: 'URL da API',
      type: 'string',
      required: true,
      default: 'https://graph.facebook.com/v18.0',
      placeholder: 'https://graph.facebook.com/v18.0',
      description: 'URL base da API do WhatsApp (Cloud API ou On-Premise)',
    },
    {
      name: 'accessToken',
      displayName: 'Token de Acesso',
      type: 'password',
      required: true,
      placeholder: 'EAAxxxxxxx...',
      description: 'Token de acesso permanente do WhatsApp Business',
    },
    {
      name: 'phoneNumberId',
      displayName: 'ID do Telefone',
      type: 'string',
      required: true,
      placeholder: '123456789012345',
      description: 'ID do número de telefone registrado no Meta Business',
    },
    {
      name: 'businessAccountId',
      displayName: 'ID da Conta Business',
      type: 'string',
      required: false,
      placeholder: '123456789012345',
      description: 'ID da conta do WhatsApp Business (opcional)',
    },
  ],

  test: {
    request: {
      url: '{{apiUrl}}/{{phoneNumberId}}',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer {{accessToken}}',
      },
    },
  },
};
