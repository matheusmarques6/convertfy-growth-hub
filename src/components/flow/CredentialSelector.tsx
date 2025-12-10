import { useState, useEffect } from 'react';
import { Plus, Key, AlertCircle, Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCredentialsStore } from '@/store/credentialsStore';
import { CredentialType, IStoredCredential } from '@/types/credentials';
import { getCredentialDefinition } from '@/services/credentials/definitions';
import { CredentialModal } from '@/pages/flows/components/CredentialModal';

interface CredentialSelectorProps {
  label?: string;
  credentialType: CredentialType | CredentialType[];
  selectedId: string | null | undefined;
  onChange: (credentialId: string | null) => void;
  required?: boolean;
  description?: string;
  className?: string;
}

export function CredentialSelector({
  label = 'Credential',
  credentialType,
  selectedId,
  onChange,
  required = false,
  description,
  className = '',
}: CredentialSelectorProps) {
  const { credentials, fetchAll } = useCredentialsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch credentials on mount
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Filter credentials by type(s)
  const types = Array.isArray(credentialType) ? credentialType : [credentialType];
  const availableCredentials = credentials.filter((c) =>
    types.includes(c.type)
  );

  // Get selected credential info
  const selectedCredential = selectedId
    ? credentials.find((c) => c.id === selectedId)
    : null;

  // Get display name for the credential type
  const getTypeDisplayName = () => {
    if (types.length === 1) {
      const def = getCredentialDefinition(types[0]);
      return def?.displayName || types[0];
    }
    return 'Credential';
  };

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = () => {
    setIsModalOpen(false);
    fetchAll();
    // Auto-select the newly created credential if there's only one more
    setTimeout(() => {
      const updatedCredentials = useCredentialsStore.getState().credentials;
      const filteredNew = updatedCredentials.filter((c) => types.includes(c.type));
      if (filteredNew.length === availableCredentials.length + 1) {
        const newCred = filteredNew.find(
          (c) => !availableCredentials.some((ac) => ac.id === c.id)
        );
        if (newCred) {
          onChange(newCred.id);
        }
      }
    }, 100);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </Label>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleCreateNew}
          className="text-xs text-orange-400 hover:text-orange-300 h-auto py-1"
        >
          <Plus className="w-3 h-3 mr-1" />
          Nova
        </Button>
      </div>

      <Select
        value={selectedId || 'none'}
        onValueChange={(v) => onChange(v === 'none' ? null : v)}
      >
        <SelectTrigger
          className={`bg-gray-800 border-gray-700 text-white ${
            required && !selectedId ? 'border-yellow-500/50' : ''
          }`}
        >
          <SelectValue placeholder={`Selecione ${getTypeDisplayName()}...`}>
            {selectedCredential ? (
              <div className="flex items-center gap-2">
                <Key className="w-3 h-3 text-gray-400" />
                <span>{selectedCredential.name}</span>
              </div>
            ) : (
              <span className="text-gray-500">Selecione {getTypeDisplayName()}...</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="none" className="text-gray-400">
            Nenhuma credential
          </SelectItem>
          {availableCredentials.length === 0 ? (
            <div className="px-2 py-3 text-center">
              <AlertCircle className="w-5 h-5 text-gray-500 mx-auto mb-2" />
              <p className="text-xs text-gray-500">
                Nenhuma credential de {getTypeDisplayName()} encontrada
              </p>
              <Button
                type="button"
                size="sm"
                variant="link"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCreateNew();
                }}
                className="text-xs text-orange-400 mt-1"
              >
                Criar agora
              </Button>
            </div>
          ) : (
            availableCredentials.map((cred) => {
              const def = getCredentialDefinition(cred.type);
              return (
                <SelectItem
                  key={cred.id}
                  value={cred.id}
                  className="text-white hover:bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <Key className="w-3 h-3 text-gray-400" />
                    <span>{cred.name}</span>
                    {types.length > 1 && def && (
                      <span className="text-xs text-gray-500">
                        ({def.displayName})
                      </span>
                    )}
                  </div>
                </SelectItem>
              );
            })
          )}
        </SelectContent>
      </Select>

      {description && <p className="text-xs text-gray-500">{description}</p>}

      {selectedCredential && (
        <div className="flex items-center gap-1 text-xs text-green-400">
          <Check className="w-3 h-3" />
          <span>Credential configurada</span>
        </div>
      )}

      {/* Modal for creating new credential */}
      <CredentialModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        credential={null}
      />
    </div>
  );
}

// Simplified version for inline use
interface InlineCredentialSelectorProps {
  credentialType: CredentialType;
  selectedId: string | null | undefined;
  onChange: (credentialId: string | null) => void;
}

export function InlineCredentialSelector({
  credentialType,
  selectedId,
  onChange,
}: InlineCredentialSelectorProps) {
  const credentials = useCredentialsStore((state) =>
    state.credentials.filter((c) => c.type === credentialType)
  );

  return (
    <Select
      value={selectedId || 'none'}
      onValueChange={(v) => onChange(v === 'none' ? null : v)}
    >
      <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-9">
        <SelectValue placeholder="Selecione..." />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700">
        <SelectItem value="none" className="text-gray-400">
          Nenhuma
        </SelectItem>
        {credentials.map((cred) => (
          <SelectItem
            key={cred.id}
            value={cred.id}
            className="text-white hover:bg-gray-700"
          >
            {cred.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
