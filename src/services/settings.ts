import api from './api';
import { ApiResponse } from '@/types/api';

// Interface para credenciais Meta API
export interface MetaApiKeys {
  id?: number;
  uid?: string;
  waba_id: string;
  business_account_id: string;
  access_token: string;
  business_phone_number_id: string;
  app_id: string;
  createdAt?: string;
}

// Interface para perfil do usuario
export interface UserProfile {
  name: string;
  email: string;
  mobile_with_country_code: string;
  timezone: string;
  newPassword?: string;
}

// Interface para perfil do WhatsApp Business
export interface WhatsAppBusinessProfile {
  verified_name?: string;
  display_phone_number?: string;
  quality_rating?: string;
  about?: string;
  address?: string;
  description?: string;
  email?: string;
  profile_picture_url?: string;
  websites?: string[];
  vertical?: string;
}

export const settingsService = {
  // ==================== META API KEYS ====================

  // Obter credenciais Meta API
  async getMetaKeys(): Promise<ApiResponse<MetaApiKeys>> {
    const response = await api.get<ApiResponse<MetaApiKeys>>('/user/get_meta_keys');
    return response.data;
  },

  // Atualizar credenciais Meta API
  async updateMetaKeys(data: MetaApiKeys): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/user/update_meta', data);
    return response.data;
  },

  // ==================== PERFIL ====================

  // Atualizar perfil do usuario
  async updateProfile(data: UserProfile): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/user/update_profile', data);
    return response.data;
  },

  // Buscar perfil do WhatsApp Business (via Meta API)
  async fetchWhatsAppProfile(): Promise<ApiResponse<WhatsAppBusinessProfile>> {
    const response = await api.get<ApiResponse<WhatsAppBusinessProfile>>('/user/fetch_profile');
    return response.data;
  },

  // ==================== API KEY ====================

  // Obter API key do usuario (para integracao externa)
  async getApiKey(): Promise<ApiResponse<{ api_key: string }>> {
    const response = await api.get<ApiResponse<{ api_key: string }>>('/user/get_api_key');
    return response.data;
  },

  // Regenerar API key
  async regenerateApiKey(): Promise<ApiResponse<{ api_key: string }>> {
    const response = await api.post<ApiResponse<{ api_key: string }>>('/user/regenerate_api_key');
    return response.data;
  },
};
