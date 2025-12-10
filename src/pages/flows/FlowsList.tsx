import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Copy,
  Edit,
  TrendingDown,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { flowStorageService, StoredFlow } from '@/services/flowStorage';
import { CredentialsList } from './components/CredentialsList';

// Stats card component
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
}

function StatCard({ title, value, change, changeType, subtitle }: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="text-xs text-gray-400 mb-1">{title}</div>
      <div className="text-sm text-gray-500">{subtitle}</div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        {change && (
          <span
            className={`text-xs flex items-center gap-0.5 ${
              changeType === 'positive'
                ? 'text-green-400'
                : changeType === 'negative'
                ? 'text-red-400'
                : 'text-gray-400'
            }`}
          >
            {changeType === 'positive' ? (
              <TrendingUp className="w-3 h-3" />
            ) : changeType === 'negative' ? (
              <TrendingDown className="w-3 h-3" />
            ) : null}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

// Tab component
interface Tab {
  id: string;
  label: string;
  count?: number;
}

const tabs: Tab[] = [
  { id: 'workflows', label: 'Workflows' },
  { id: 'credentials', label: 'Credentials' },
];

// Tag colors
const tagColors: Record<string, string> = {
  'WhatsApp IA': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Criativvo': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Banco de Dados': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Webhook': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  default: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

function getTagColor(tag: string): string {
  return tagColors[tag] || tagColors.default;
}

export default function FlowsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('workflows');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('last_updated');
  const [flows, setFlows] = useState<StoredFlow[]>([]);
  const [stats, setStats] = useState({
    totalExecutions: 0,
    failedExecutions: 0,
    failureRate: 0,
    avgRunTime: 0,
  });

  // Load flows on mount
  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = () => {
    const storedFlows = flowStorageService.getAllFlows();
    setFlows(storedFlows);

    // Calculate stats from flows
    const total = storedFlows.reduce((acc, f) => acc + (f.stats?.executions || 0), 0);
    const failed = storedFlows.reduce((acc, f) => acc + (f.stats?.failures || 0), 0);
    setStats({
      totalExecutions: total,
      failedExecutions: failed,
      failureRate: total > 0 ? (failed / total) * 100 : 0,
      avgRunTime: storedFlows.reduce((acc, f) => acc + (f.stats?.avgRunTime || 0), 0) / (storedFlows.length || 1),
    });
  };

  const handleCreateFlow = () => {
    navigate('/flow/new');
  };

  const handleEditFlow = (flowId: string) => {
    navigate(`/flow/${flowId}`);
  };

  const handleDuplicateFlow = (flow: StoredFlow) => {
    const newFlow = flowStorageService.duplicateFlow(flow.flow_id);
    if (newFlow) {
      loadFlows();
      toast({
        title: 'Flow duplicado',
        description: `"${newFlow.name}" foi criado com sucesso.`,
      });
    }
  };

  const handleDeleteFlow = (flowId: string, flowName: string) => {
    if (confirm(`Tem certeza que deseja excluir "${flowName}"?`)) {
      flowStorageService.deleteFlow(flowId);
      loadFlows();
      toast({
        title: 'Flow excluído',
        description: `"${flowName}" foi removido.`,
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = (flowId: string, currentStatus: boolean) => {
    flowStorageService.updateFlow(flowId, { is_active: !currentStatus });
    loadFlows();
  };

  // Filter and sort flows
  const filteredFlows = flows
    .filter((flow) =>
      flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'last_updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Overview</h1>
              <p className="text-sm text-gray-400 mt-1">
                All the workflows, credentials and data tables you have access to
              </p>
            </div>
            <Button
              onClick={handleCreateFlow}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create workflow
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-5 gap-4">
          <StatCard
            title="Prod. executions"
            subtitle="Last 7 days"
            value={stats.totalExecutions.toLocaleString()}
            change="57.03%"
            changeType="negative"
          />
          <StatCard
            title="Failed prod. executions"
            subtitle="Last 7 days"
            value={stats.failedExecutions}
            change="60.61%"
            changeType="negative"
          />
          <StatCard
            title="Failure rate"
            subtitle="Last 7 days"
            value={`${stats.failureRate.toFixed(1)}%`}
            change="1.3pp"
            changeType="negative"
          />
          <StatCard
            title="Time saved"
            subtitle="Last 7 days"
            value="--"
          />
          <StatCard
            title="Run time (avg.)"
            subtitle="Last 7 days"
            value={`${stats.avgRunTime.toFixed(2)}s`}
            change="0.06s"
            changeType="negative"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-6 border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-orange-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'workflows' && (
          <>
            {/* Search and filters */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="last_updated" className="text-white hover:bg-gray-800">
                      Sort by last updated
                    </SelectItem>
                    <SelectItem value="name" className="text-white hover:bg-gray-800">
                      Sort by name
                    </SelectItem>
                    <SelectItem value="created" className="text-white hover:bg-gray-800">
                      Sort by created
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="border-gray-700">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Workflows list */}
            <div className="space-y-2">
              {filteredFlows.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">No workflows found</div>
                  <Button onClick={handleCreateFlow} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first workflow
                  </Button>
                </div>
              ) : (
                filteredFlows.map((flow) => (
                  <div
                    key={flow.flow_id}
                    className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleEditFlow(flow.flow_id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-white">{flow.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>Last updated {formatDate(flow.updatedAt)}</span>
                          <span>|</span>
                          <span>Created {formatDate(flow.createdAt)}</span>
                          {/* Tags */}
                          {flow.tags && flow.tags.length > 0 && (
                            <>
                              {flow.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`px-2 py-0.5 rounded text-xs border ${getTagColor(tag)}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSearchQuery(tag);
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400">Personal</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs ${
                              flow.is_active ? 'text-green-400' : 'text-gray-500'
                            }`}
                          >
                            {flow.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <Switch
                            checked={flow.is_active}
                            onCheckedChange={() =>
                              handleToggleActive(flow.flow_id, flow.is_active)
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="data-[state=checked]:bg-green-500"
                          />
                        </div>

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
                                handleEditFlow(flow.flow_id);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-white hover:bg-gray-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateFlow(flow);
                              }}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem
                              className="text-red-400 hover:bg-gray-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFlow(flow.flow_id, flow.name);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'credentials' && (
          <CredentialsList />
        )}
      </div>
    </div>
  );
}
