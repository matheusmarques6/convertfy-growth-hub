import { useState, useEffect } from 'react';
import {
  X,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCredentialsStore } from '@/store/credentialsStore';
import {
  IStoredCredential,
  ICredentialData,
  ICredentialProperty,
  CredentialType,
} from '@/types/credentials';
import {
  getAllCredentialDefinitions,
  getCredentialDefinition,
  getCredentialCategories,
} from '@/services/credentials/definitions';

interface CredentialModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  credential?: IStoredCredential | null;
}

export function CredentialModal({
  open,
  onClose,
  onSave,
  credential,
}: CredentialModalProps) {
  const { toast } = useToast();
  const { create, update, decrypt, testConnection } = useCredentialsStore();

  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<CredentialType | ''>('');
  const [formData, setFormData] = useState<ICredentialData>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const allDefinitions = getAllCredentialDefinitions();
  const categories = getCredentialCategories();
  const currentDefinition = selectedType
    ? getCredentialDefinition(selectedType)
    : null;

  // Load credential data when editing
  useEffect(() => {
    if (credential) {
      setName(credential.name);
      setSelectedType(credential.type);
      const decryptedData = decrypt(credential.id);
      if (decryptedData) {
        setFormData(decryptedData);
      }
    } else {
      setName('');
      setSelectedType('');
      setFormData({});
    }
    setShowPasswords({});
    setTestResult(null);
    setErrors({});
  }, [credential, open, decrypt]);

  // Initialize form data when type changes
  useEffect(() => {
    if (currentDefinition && !credential) {
      const initialData: ICredentialData = {};
      currentDefinition.properties.forEach((prop) => {
        if (prop.default !== undefined) {
          initialData[prop.name] = prop.default as string | number | boolean;
        }
      });
      setFormData(initialData);
    }
  }, [currentDefinition, credential]);

  const handleFieldChange = (fieldName: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!selectedType) {
      newErrors.type = 'Selecione um tipo de credential';
    }

    if (currentDefinition) {
      currentDefinition.properties.forEach((prop) => {
        if (prop.required) {
          const value = formData[prop.name];
          if (value === undefined || value === null || value === '') {
            newErrors[prop.name] = `${prop.displayName} é obrigatório`;
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTest = async () => {
    if (!selectedType || !currentDefinition) return;

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testConnection(selectedType, formData);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao testar conexão',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    try {
      if (credential) {
        // Update existing
        update(credential.id, {
          name: name.trim(),
          data: formData,
        });
        toast({
          title: 'Credential atualizada',
          description: `"${name}" foi atualizada com sucesso.`,
        });
      } else {
        // Create new
        create(name.trim(), selectedType as CredentialType, formData);
        toast({
          title: 'Credential criada',
          description: `"${name}" foi criada com sucesso.`,
        });
      }
      onSave();
    } catch (error) {
      toast({
        title: 'Erro',
        description:
          error instanceof Error ? error.message : 'Erro ao salvar credential',
        variant: 'destructive',
      });
    }
  };

  const shouldShowField = (prop: ICredentialProperty): boolean => {
    if (!prop.displayOptions) return true;

    const { show, hide } = prop.displayOptions;

    if (show) {
      for (const [field, values] of Object.entries(show)) {
        if (!values.includes(formData[field])) {
          return false;
        }
      }
    }

    if (hide) {
      for (const [field, values] of Object.entries(hide)) {
        if (values.includes(formData[field])) {
          return false;
        }
      }
    }

    return true;
  };

  const renderField = (prop: ICredentialProperty) => {
    if (!shouldShowField(prop)) return null;

    const value = formData[prop.name];
    const error = errors[prop.name];

    switch (prop.type) {
      case 'password':
        return (
          <div key={prop.name} className="space-y-2">
            <Label className="text-gray-300">
              {prop.displayName}
              {prop.required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <div className="relative">
              <Input
                type={showPasswords[prop.name] ? 'text' : 'password'}
                value={(value as string) || ''}
                onChange={(e) => handleFieldChange(prop.name, e.target.value)}
                placeholder={prop.placeholder}
                className={`pr-10 bg-gray-800 border-gray-700 text-white ${
                  error ? 'border-red-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility(prop.name)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords[prop.name] ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {prop.description && (
              <p className="text-xs text-gray-500">{prop.description}</p>
            )}
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={prop.name} className="space-y-2">
            <Label className="text-gray-300">
              {prop.displayName}
              {prop.required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <Input
              type="number"
              value={(value as number) || ''}
              onChange={(e) =>
                handleFieldChange(prop.name, parseInt(e.target.value) || 0)
              }
              placeholder={prop.placeholder}
              className={`bg-gray-800 border-gray-700 text-white ${
                error ? 'border-red-500' : ''
              }`}
            />
            {prop.description && (
              <p className="text-xs text-gray-500">{prop.description}</p>
            )}
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>
        );

      case 'boolean':
        return (
          <div key={prop.name} className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">{prop.displayName}</Label>
              {prop.description && (
                <p className="text-xs text-gray-500">{prop.description}</p>
              )}
            </div>
            <Switch
              checked={(value as boolean) || false}
              onCheckedChange={(checked) => handleFieldChange(prop.name, checked)}
            />
          </div>
        );

      case 'options':
        return (
          <div key={prop.name} className="space-y-2">
            <Label className="text-gray-300">
              {prop.displayName}
              {prop.required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <Select
              value={(value as string) || ''}
              onValueChange={(v) => handleFieldChange(prop.name, v)}
            >
              <SelectTrigger
                className={`bg-gray-800 border-gray-700 text-white ${
                  error ? 'border-red-500' : ''
                }`}
              >
                <SelectValue placeholder={`Selecione ${prop.displayName}`} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {prop.options?.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-white hover:bg-gray-700"
                  >
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {prop.description && (
              <p className="text-xs text-gray-500">{prop.description}</p>
            )}
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>
        );

      default:
        return (
          <div key={prop.name} className="space-y-2">
            <Label className="text-gray-300">
              {prop.displayName}
              {prop.required && <span className="text-red-400 ml-1">*</span>}
            </Label>
            <Input
              type="text"
              value={(value as string) || ''}
              onChange={(e) => handleFieldChange(prop.name, e.target.value)}
              placeholder={prop.placeholder}
              className={`bg-gray-800 border-gray-700 text-white ${
                error ? 'border-red-500' : ''
              }`}
            />
            {prop.description && (
              <p className="text-xs text-gray-500">{prop.description}</p>
            )}
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>
        );
    }
  };

  // Group definitions by category
  const definitionsByCategory = categories.map((cat) => ({
    ...cat,
    definitions: allDefinitions.filter((def) => def.category === cat.value),
  }));

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {credential ? 'Editar Credential' : 'Nova Credential'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name field */}
          <div className="space-y-2">
            <Label className="text-gray-300">
              Nome <span className="text-red-400">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Minha API WhatsApp"
              className={`bg-gray-800 border-gray-700 text-white ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
          </div>

          {/* Type selection (only for new credentials) */}
          {!credential && (
            <div className="space-y-2">
              <Label className="text-gray-300">
                Tipo <span className="text-red-400">*</span>
              </Label>
              <Select
                value={selectedType}
                onValueChange={(v) => setSelectedType(v as CredentialType)}
              >
                <SelectTrigger
                  className={`bg-gray-800 border-gray-700 text-white ${
                    errors.type ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Selecione o tipo de credential" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 max-h-80">
                  {definitionsByCategory.map(
                    (cat) =>
                      cat.definitions.length > 0 && (
                        <div key={cat.value}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
                            {cat.name}
                          </div>
                          {cat.definitions.map((def) => (
                            <SelectItem
                              key={def.name}
                              value={def.name}
                              className="text-white hover:bg-gray-700"
                            >
                              <div className="flex items-center gap-2">
                                <span>{def.displayName}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      )
                  )}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-red-400">{errors.type}</p>}
            </div>
          )}

          {/* Show selected type info */}
          {credential && currentDefinition && (
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-sm font-medium text-white">
                {currentDefinition.displayName}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {currentDefinition.description}
              </div>
            </div>
          )}

          {/* Dynamic form fields */}
          {currentDefinition && (
            <div className="space-y-4 pt-2 border-t border-gray-800">
              {currentDefinition.properties.map(renderField)}
            </div>
          )}

          {/* Test connection result */}
          {testResult && (
            <div
              className={`p-3 rounded-lg flex items-start gap-2 ${
                testResult.success
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}
            >
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <div
                  className={`text-sm font-medium ${
                    testResult.success ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {testResult.success ? 'Conexão bem-sucedida' : 'Falha na conexão'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {testResult.message}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center gap-2">
          {currentDefinition?.test && (
            <Button
              type="button"
              variant="outline"
              onClick={handleTest}
              disabled={isTesting || !selectedType}
              className="border-gray-700"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                'Testar Conexão'
              )}
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {credential ? 'Salvar Alterações' : 'Criar Credential'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
