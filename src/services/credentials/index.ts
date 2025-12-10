// Export credentials service
export { credentialsService } from './credentialsService';

// Export credential definitions
export {
  credentialDefinitions,
  getAllCredentialDefinitions,
  getCredentialDefinition,
  getCredentialsByCategory,
  getCredentialCategories,
} from './definitions';

// Re-export types
export type {
  IStoredCredential,
  ICredentialData,
  ICredentialTypeDefinition,
  ICredentialProperty,
  ICredentialTestResult,
  CredentialType,
} from '@/types/credentials';
