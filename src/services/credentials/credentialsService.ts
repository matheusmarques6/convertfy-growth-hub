import CryptoJS from 'crypto-js';
import { IStoredCredential, ICredentialData, CredentialType } from '@/types/credentials';
import { getCredentialDefinition } from './definitions';

const STORAGE_KEY = 'convertfy_credentials';

// Em produção, isso deveria vir de uma variável de ambiente segura
// Para o localStorage estamos usando uma chave fixa (menos seguro, mas funcional para dev)
const getEncryptionKey = (): string => {
  // Tenta obter do sessionStorage uma chave única da sessão
  let sessionKey = sessionStorage.getItem('convertfy_session_key');
  if (!sessionKey) {
    // Gera uma chave baseada em algo único do browser + timestamp fixo
    sessionKey = CryptoJS.SHA256(
      navigator.userAgent + 'convertfy-credentials-v1'
    ).toString();
    sessionStorage.setItem('convertfy_session_key', sessionKey);
  }
  return sessionKey;
};

export const credentialsService = {
  /**
   * Lista todas as credentials salvas
   */
  getAll(): IStoredCredential[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      console.error('Failed to parse stored credentials');
      return [];
    }
  },

  /**
   * Busca credentials por tipo
   */
  getByType(type: CredentialType): IStoredCredential[] {
    return this.getAll().filter(c => c.type === type);
  },

  /**
   * Busca credential por ID
   */
  getById(id: string): IStoredCredential | null {
    return this.getAll().find(c => c.id === id) || null;
  },

  /**
   * Cria uma nova credential
   */
  create(name: string, type: CredentialType, data: ICredentialData): IStoredCredential {
    const credentials = this.getAll();
    const now = new Date().toISOString();

    const newCredential: IStoredCredential = {
      id: `cred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      data: this.encrypt(data),
      createdAt: now,
      updatedAt: now,
    };

    credentials.push(newCredential);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
    return newCredential;
  },

  /**
   * Atualiza uma credential existente
   */
  update(id: string, updates: Partial<{ name: string; data: ICredentialData }>): IStoredCredential | null {
    const credentials = this.getAll();
    const index = credentials.findIndex(c => c.id === id);

    if (index === -1) return null;

    if (updates.name !== undefined) {
      credentials[index].name = updates.name;
    }
    if (updates.data !== undefined) {
      credentials[index].data = this.encrypt(updates.data);
    }
    credentials[index].updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
    return credentials[index];
  },

  /**
   * Deleta uma credential
   */
  delete(id: string): boolean {
    const credentials = this.getAll();
    const filtered = credentials.filter(c => c.id !== id);

    if (filtered.length === credentials.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  /**
   * Duplica uma credential
   */
  duplicate(id: string): IStoredCredential | null {
    const credential = this.getById(id);
    if (!credential) return null;

    const decrypted = this.decrypt(id);
    if (!decrypted) return null;

    return this.create(`${credential.name} (cópia)`, credential.type, decrypted);
  },

  /**
   * Descriptografa os dados de uma credential
   */
  decrypt(id: string): ICredentialData | null {
    const credential = this.getById(id);
    if (!credential) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(credential.data, getEncryptionKey());
      const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedStr) return null;
      return JSON.parse(decryptedStr);
    } catch (error) {
      console.error('Failed to decrypt credential:', error);
      return null;
    }
  },

  /**
   * Criptografa dados de credential
   */
  encrypt(data: ICredentialData): string {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      getEncryptionKey()
    ).toString();
  },

  /**
   * Testa a conexão de uma credential
   */
  async test(type: CredentialType, data: ICredentialData): Promise<{ success: boolean; message: string }> {
    const definition = getCredentialDefinition(type);
    if (!definition?.test) {
      return { success: true, message: 'Credential salva (sem teste disponível)' };
    }

    try {
      // Substituir variáveis na URL e headers
      let url = definition.test.request.url;
      const headers: Record<string, string> = { ...definition.test.request.headers };

      // Substituir placeholders {{variável}} pelos valores
      const replaceVars = (str: string): string => {
        return str.replace(/\{\{(\w+)\}\}/g, (_, key) => {
          return String(data[key] || '');
        });
      };

      url = replaceVars(url);
      Object.keys(headers).forEach(key => {
        headers[key] = replaceVars(headers[key]);
      });

      // Fazer requisição de teste
      const response = await fetch(url, {
        method: definition.test.request.method,
        headers,
      });

      if (response.ok) {
        return { success: true, message: 'Conexão bem-sucedida!' };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          message: `Erro ${response.status}: ${errorText.substring(0, 100)}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido ao testar conexão',
      };
    }
  },

  /**
   * Verifica se uma credential está sendo usada em algum flow
   */
  isInUse(credentialId: string): { inUse: boolean; flowNames: string[] } {
    try {
      const flowsStorage = localStorage.getItem('convertfy_flows');
      if (!flowsStorage) return { inUse: false, flowNames: [] };

      const flows = JSON.parse(flowsStorage);
      const usingFlows: string[] = [];

      for (const flow of flows) {
        const nodes = flow.data?.nodes || [];
        for (const node of nodes) {
          if (node.data?.credentialId === credentialId) {
            usingFlows.push(flow.name);
            break;
          }
        }
      }

      return {
        inUse: usingFlows.length > 0,
        flowNames: usingFlows,
      };
    } catch {
      return { inUse: false, flowNames: [] };
    }
  },

  /**
   * Exporta credentials (para backup - sem dados sensíveis)
   */
  exportMetadata(): Array<Omit<IStoredCredential, 'data'>> {
    return this.getAll().map(({ data: _, ...rest }) => rest);
  },

  /**
   * Conta credentials por tipo
   */
  countByType(): Record<CredentialType, number> {
    const credentials = this.getAll();
    const counts: Partial<Record<CredentialType, number>> = {};

    for (const cred of credentials) {
      counts[cred.type] = (counts[cred.type] || 0) + 1;
    }

    return counts as Record<CredentialType, number>;
  },
};
