import api from './api';
import { ApiResponse } from '@/types/api';

// Interface para Meta Template do WhatsApp Business API
export interface MetaTemplateComponent {
  type: string;
  format?: string;
  text?: string;
  example?: {
    header_text?: string[];
    body_text?: string[][];
  };
  buttons?: Array<{
    type: string;
    text: string;
    url?: string;
    phone_number?: string;
  }>;
}

export interface MetaTemplate {
  id: string;
  name: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  category: string;
  language: string;
  components: MetaTemplateComponent[];
}

// Interface para template de usuário (simples)
export interface UserTemplate {
  id: number;
  uid: string;
  title: string;
  type: string;
  content: string; // JSON stringified
  createdAt: string;
}

// Interface para criar Meta template
export interface CreateMetaTemplateData {
  name: string;
  category: string;
  allow_category_change: boolean;
  language: string;
  components: MetaTemplateComponent[];
}

// Interface para criar template de usuário
export interface CreateUserTemplateData {
  title: string;
  type: string;
  content: {
    text?: string;
    header?: string;
    footer?: string;
    buttons?: Array<{ type: string; text: string }>;
  };
}

export const templateService = {
  // ==================== META TEMPLATES ====================

  // Listar Meta templates (do WhatsApp Business API)
  async getMetaTemplates(): Promise<ApiResponse<MetaTemplate[]>> {
    const response = await api.get<ApiResponse<MetaTemplate[]>>('/user/get_my_meta_templets');
    return response.data;
  },

  // Criar Meta template
  async createMetaTemplate(data: CreateMetaTemplateData): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/user/add_meta_templet', data);
    return response.data;
  },

  // Excluir Meta template
  async deleteMetaTemplate(name: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/user/del_meta_templet', { name });
    return response.data;
  },

  // Upload de mídia para Meta template
  async uploadMetaTemplateMedia(
    templetName: string,
    file: File
  ): Promise<ApiResponse<{ url: string; hash: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('templet_name', templetName);

    const response = await api.post<ApiResponse<{ url: string; hash: string }>>(
      '/user/return_media_url_meta',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // ==================== USER TEMPLATES ====================

  // Listar templates de usuário
  async getUserTemplates(): Promise<ApiResponse<UserTemplate[]>> {
    const response = await api.get<ApiResponse<UserTemplate[]>>('/templet/get_templets');
    return response.data;
  },

  // Criar template de usuário
  async createUserTemplate(data: CreateUserTemplateData): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/templet/add_new', data);
    return response.data;
  },

  // Excluir templates de usuário
  async deleteUserTemplates(selected: number[]): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/templet/del_templets', { selected });
    return response.data;
  },

  // ==================== ENVIO ====================

  // Enviar template via API v2
  async sendTemplate(data: {
    sendTo: string;
    templetName: string;
    exampleArr: string[];
    mediaUri?: string;
  }): Promise<ApiResponse> {
    const token = localStorage.getItem('token');
    const response = await api.post<ApiResponse>('/apiv2/send_templet', {
      ...data,
      token,
    });
    return response.data;
  },
};
