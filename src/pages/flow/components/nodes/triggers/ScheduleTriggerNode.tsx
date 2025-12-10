import { Handle, Position } from '@xyflow/react';
import { Calendar, Clock, Repeat, Zap } from 'lucide-react';
import { triggerConfigs, ScheduleTriggerData } from './types';

interface ScheduleTriggerNodeProps {
  data: ScheduleTriggerData;
  selected?: boolean;
}

export function ScheduleTriggerNode({ data, selected }: ScheduleTriggerNodeProps) {
  const config = triggerConfigs.TRIGGER_SCHEDULE;

  const scheduleType = data?.scheduleType || 'recurring';
  const cronExpression = data?.cronExpression || '';
  const timezone = data?.timezone || 'America/Sao_Paulo';

  // Parse cron expression to human-readable format
  const getCronDescription = (cron: string): string => {
    if (!cron) return '';

    // Simple cron parsing for common patterns
    const parts = cron.split(' ');
    if (parts.length !== 5) return cron;

    const [minute, hour, dayMonth, month, dayWeek] = parts;

    // Every minute
    if (cron === '* * * * *') return 'A cada minuto';

    // Every hour
    if (minute !== '*' && hour === '*' && dayMonth === '*' && month === '*' && dayWeek === '*') {
      return `A cada hora no minuto ${minute}`;
    }

    // Daily at specific time
    if (dayMonth === '*' && month === '*' && dayWeek === '*') {
      return `Diariamente às ${hour}:${minute.padStart(2, '0')}`;
    }

    // Weekly
    if (dayMonth === '*' && month === '*' && dayWeek !== '*') {
      const days: Record<string, string> = {
        '0': 'Domingo',
        '1': 'Segunda',
        '2': 'Terça',
        '3': 'Quarta',
        '4': 'Quinta',
        '5': 'Sexta',
        '6': 'Sábado',
      };
      return `${days[dayWeek] || 'Semanal'} às ${hour}:${minute.padStart(2, '0')}`;
    }

    return cron;
  };

  const renderPreview = () => {
    if (!cronExpression && scheduleType === 'recurring') {
      return (
        <div className="flex items-center gap-2 text-xs text-yellow-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Configure o agendamento</span>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {scheduleType === 'recurring' ? (
            <Repeat className="w-3.5 h-3.5 text-purple-400" />
          ) : (
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
          )}
          <span className="text-xs text-gray-300">
            {scheduleType === 'recurring' ? 'Recorrente' : 'Uma vez'}
          </span>
        </div>

        {cronExpression && (
          <div className="text-xs text-white bg-purple-500/20 px-2 py-1 rounded">
            {getCronDescription(cronExpression)}
          </div>
        )}

        <div className="text-xs text-gray-500">
          Fuso: {timezone}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`
        min-w-[240px] rounded-2xl border-2 overflow-hidden
        transition-all duration-200
        ${selected ? 'shadow-lg ring-2 ring-offset-2 ring-offset-gray-950' : ''}
      `}
      style={{
        borderColor: selected ? config.color : `${config.color}80`,
        backgroundColor: config.bgColor,
        boxShadow: selected ? `0 0 20px ${config.color}40` : undefined,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-2.5 flex items-center gap-2"
        style={{ backgroundColor: config.color }}
      >
        <Zap className="w-4 h-4 text-white" />
        <span className="text-sm font-semibold text-white">Gatilho</span>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl"
            style={{ backgroundColor: `${config.color}30` }}
          >
            <Calendar className="w-5 h-5" style={{ color: config.color }} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">{config.label}</div>
            <div className="text-xs text-gray-400">{config.description}</div>
          </div>
        </div>

        {/* Preview section */}
        <div className="mt-3 pt-3 border-t border-white/10">
          {renderPreview()}
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="trigger-out"
        className="!w-4 !h-4 !border-2 !border-white"
        style={{ backgroundColor: config.color, right: -8 }}
      />
    </div>
  );
}
