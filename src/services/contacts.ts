import api from './api';
import { ApiResponse } from '@/types/api';

// Interface para contato do backend real
export interface ContactData {
  id: number;
  uid: string;
  phonebook_id: number;
  phonebook_name: string;
  name: string;
  mobile: string;
  var1?: string;
  var2?: string;
  var3?: string;
  var4?: string;
  var5?: string;
  createdAt: string;
}

// Interface para phonebook do backend real
export interface PhonebookData {
  id: number;
  uid: string;
  name: string;
  contactCount?: number;
  createdAt: string;
}

export const contactService = {
  // ==================== CONTATOS ====================

  // Listar todos os contatos do usuário
  async getContacts(): Promise<ApiResponse<ContactData[]>> {
    const response = await api.get<ApiResponse<ContactData[]>>('/phonebook/get_uid_contacts');
    return response.data;
  },

  // Adicionar contato único
  async addContact(data: {
    id: number; // phonebook_id
    phonebook_name: string;
    name?: string;
    mobile: string;
    var1?: string;
    var2?: string;
    var3?: string;
    var4?: string;
    var5?: string;
  }): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/phonebook/add_single_contact', data);
    return response.data;
  },

  // Excluir múltiplos contatos
  async deleteContacts(selected: number[]): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/phonebook/del_contacts', { selected });
    return response.data;
  },

  // ==================== PHONEBOOKS ====================

  // Listar phonebooks do usuário
  async getPhonebooks(): Promise<ApiResponse<PhonebookData[]>> {
    const response = await api.get<ApiResponse<PhonebookData[]>>('/phonebook/get_by_uid');
    return response.data;
  },

  // Criar phonebook
  async createPhonebook(name: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/phonebook/add', { name });
    return response.data;
  },

  // Excluir phonebook
  async deletePhonebook(id: number): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/phonebook/del_phonebook', { id });
    return response.data;
  },

  // Importar contatos via CSV
  async importCSV(
    file: File,
    phonebookId: number,
    phonebookName: string
  ): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', phonebookId.toString());
    formData.append('phonebook_name', phonebookName);

    const response = await api.post<ApiResponse>('/phonebook/import_contacts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
