import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Copy,
  Edit,
  Key,
  MessageCircle,
  Brain,
  Database,
  Lock,
  KeyRound,
  Webhook,
  Sheet,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCredentialsStore } from '@/store/credentialsStore';
import { IStoredCredential, CredentialType } from '@/types/credentials';
import { getCredentialDefinition, getCredentialCategories } from '@/services/credentials/definitions';
import { CredentialModal } from './CredentialModal';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  MessageCircle,
  Brain,
  Lock,
  Key,
  KeyRound,
  Database,
  Webhook,
  Sheet,
};

// Category colors
const categoryColors: Record<string, string> = {
  messaging: 'bg-green-500/20 text-green-300 border-green-500/30',
  ai: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  http: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  database: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  integrations: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
};

function getIcon(iconName: string) {
  const Icon = iconMap[iconName] || Key;
  return Icon;
}

export function CredentialsList() {
  const { toast } = useToast();
  const {
    credentials,
    fetchAll,
    delete: deleteCredential,
    duplicate,
  } = useCredentialsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<IStoredCredential | null>(null);
  const categories = getCredentialCategories();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCreate = () => {
    setEditingCredential(null);
    setIsModalOpen(true);
  };

  const handleEdit = (credential: IStoredCredential) => {
    setEditingCredential(credential);
    setIsModalOpen(true);
  };

  const handleDuplicate = (credential: IStoredCredential) => {
    const duplicated = duplicate(credential.id);
    if (duplicated) {
      toast({
        title: 'Credential duplicada',
        description: `"${duplicated.name}" foi criada com sucesso.`,
      });
    }
  };

  const handleDelete = (credential: IStoredCredential) => {
    if (confirm(`Tem certeza que deseja excluir "${credential.name}"?`)) {
      const success = deleteCredential(credential.id);
      if (success) {
        toast({
          title: 'Credential excluída',
          description: `"${credential.name}" foi removida.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erro ao excluir',
          description: useCredentialsStore.getState().error || 'Erro desconhecido',
          variant: 'destructive',
        });
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCredential(null);
  };

  const handleModalSave = () => {
    setIsModalOpen(false);
    setEditingCredential(null);
    fetchAll();
  };

  // Filter credentials
  const filteredCredentials = credentials.filter((cred) => {
    const matchesSearch =
      cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.type.toLowerCase().includes(searchQuery.toLowerCase());

    const definition = getCredentialDefinition(cred.type);
    const matchesCategory =
      filterCategory === 'all' || definition?.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutos atrás`;
    if (diffHours < 24) return `${diffHours} horas atrás`;
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  };

  return (
    <>
      {/* Search and filters */}
      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={handleCreate}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Credential
        </Button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Buscar credentials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all" className="text-white hover:bg-gray-800">
                Todas as categorias
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem
                  key={cat.value}
                  value={cat.value}
                  className="text-white hover:bg-gray-800"
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Credentials list */}
      <div className="space-y-2">
        {filteredCredentials.length === 0 ? (
          <div className="text-center py-12">
            <Key className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <div className="text-gray-400 mb-4">
              {searchQuery || filterCategory !== 'all'
                ? 'Nenhuma credential encontrada com esses filtros'
                : 'Nenhuma credential criada ainda'}
            </div>
            <Button onClick={handleCreate} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Criar sua primeira credential
            </Button>
          </div>
        ) : (
          filteredCredentials.map((credential) => {
            const definition = getCredentialDefinition(credential.type);
            const Icon = definition ? getIcon(definition.icon) : Key;
            const categoryColor = definition
              ? categoryColors[definition.category] || categoryColors.http
              : categoryColors.http;

            return (
              <div
                key={credential.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors cursor-pointer"
                onClick={() => handleEdit(credential)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white">{credential.name}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs border ${categoryColor}`}
                        >
                          {definition?.displayName || credential.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>Criada {formatDate(credential.createdAt)}</span>
                        <span>|</span>
                        <span>Atualizada {formatDate(credential.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-gray-900 border-gray-700"
                      >
                        <DropdownMenuItem
                          className="text-white hover:bg-gray-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(credential);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-white hover:bg-gray-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicate(credential);
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem
                          className="text-red-400 hover:bg-gray-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(credential);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <CredentialModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        credential={editingCredential}
      />
    </>
  );
}
