import { create } from 'zustand';
import { credentialsService } from '@/services/credentials/credentialsService';
import { IStoredCredential, ICredentialData, CredentialType, ICredentialTestResult } from '@/types/credentials';

interface CredentialsState {
  // Estado
  credentials: IStoredCredential[];
  isLoading: boolean;
  error: string | null;
  testResults: Record<string, ICredentialTestResult>;

  // Actions
  fetchAll: () => void;
  create: (name: string, type: CredentialType, data: ICredentialData) => IStoredCredential;
  update: (id: string, updates: Partial<{ name: string; data: ICredentialData }>) => IStoredCredential | null;
  delete: (id: string) => boolean;
  duplicate: (id: string) => IStoredCredential | null;
  getByType: (type: CredentialType) => IStoredCredential[];
  getById: (id: string) => IStoredCredential | null;
  decrypt: (id: string) => ICredentialData | null;
  testConnection: (type: CredentialType, data: ICredentialData) => Promise<ICredentialTestResult>;
  clearError: () => void;
}

export const useCredentialsStore = create<CredentialsState>((set, get) => ({
  // Estado inicial
  credentials: [],
  isLoading: false,
  error: null,
  testResults: {},

  // Buscar todas as credentials
  fetchAll: () => {
    set({ isLoading: true, error: null });
    try {
      const credentials = credentialsService.getAll();
      set({ credentials, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar credentials';
      set({ error: message, isLoading: false });
    }
  },

  // Criar nova credential
  create: (name, type, data) => {
    try {
      const newCredential = credentialsService.create(name, type, data);
      set(state => ({
        credentials: [...state.credentials, newCredential],
        error: null,
      }));
      return newCredential;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar credential';
      set({ error: message });
      throw error;
    }
  },

  // Atualizar credential
  update: (id, updates) => {
    try {
      const updated = credentialsService.update(id, updates);
      if (updated) {
        set(state => ({
          credentials: state.credentials.map(c => c.id === id ? updated : c),
          error: null,
        }));
      }
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar credential';
      set({ error: message });
      return null;
    }
  },

  // Deletar credential
  delete: (id) => {
    try {
      // Verificar se está em uso
      const { inUse, flowNames } = credentialsService.isInUse(id);
      if (inUse) {
        set({ error: `Esta credential está em uso nos flows: ${flowNames.join(', ')}` });
        return false;
      }

      const success = credentialsService.delete(id);
      if (success) {
        set(state => ({
          credentials: state.credentials.filter(c => c.id !== id),
          error: null,
        }));
      }
      return success;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao deletar credential';
      set({ error: message });
      return false;
    }
  },

  // Duplicar credential
  duplicate: (id) => {
    try {
      const duplicated = credentialsService.duplicate(id);
      if (duplicated) {
        set(state => ({
          credentials: [...state.credentials, duplicated],
          error: null,
        }));
      }
      return duplicated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao duplicar credential';
      set({ error: message });
      return null;
    }
  },

  // Buscar por tipo
  getByType: (type) => {
    return get().credentials.filter(c => c.type === type);
  },

  // Buscar por ID
  getById: (id) => {
    return get().credentials.find(c => c.id === id) || null;
  },

  // Descriptografar dados
  decrypt: (id) => {
    return credentialsService.decrypt(id);
  },

  // Testar conexão
  testConnection: async (type, data) => {
    const result = await credentialsService.test(type, data);
    return {
      ...result,
      testedAt: new Date().toISOString(),
    };
  },

  // Limpar erro
  clearError: () => set({ error: null }),
}));

// Selector hooks para uso otimizado
export const useCredentials = () => useCredentialsStore((state) => state.credentials);
export const useCredentialsLoading = () => useCredentialsStore((state) => state.isLoading);
export const useCredentialsError = () => useCredentialsStore((state) => state.error);

// Hook para buscar credentials por tipo
export const useCredentialsByType = (type: CredentialType) => {
  return useCredentialsStore((state) => state.credentials.filter(c => c.type === type));
};
