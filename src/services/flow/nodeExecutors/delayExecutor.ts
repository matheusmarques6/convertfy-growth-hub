import { NodeExecutor, INodeExecutionResult } from './types';

export const delayExecutor: NodeExecutor = async (nodeData, context) => {
  const { delayTime = 1, delayUnit = 'seconds' } = nodeData as {
    delayTime: number;
    delayUnit: 'seconds' | 'minutes' | 'hours';
  };

  const logs: string[] = [];

  try {
    // Calcular tempo de delay em milissegundos
    let delayMs: number;
    switch (delayUnit) {
      case 'minutes':
        delayMs = delayTime * 60 * 1000;
        break;
      case 'hours':
        delayMs = delayTime * 60 * 60 * 1000;
        break;
      default:
        delayMs = delayTime * 1000;
    }

    // Limitar a 1 hora máximo para evitar problemas
    const maxDelay = 60 * 60 * 1000; // 1 hora
    if (delayMs > maxDelay) {
      logs.push(`Aviso: Delay limitado a 1 hora (solicitado: ${delayTime} ${delayUnit})`);
      delayMs = maxDelay;
    }

    logs.push(`Aguardando ${delayTime} ${delayUnit} (${delayMs}ms)`);
    context.log(`Iniciando delay de ${delayTime} ${delayUnit}`);

    // Aguardar
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    logs.push(`Delay concluído`);
    context.log(`Delay concluído`);

    return {
      success: true,
      output: {
        delayTime,
        delayUnit,
        delayMs,
      },
      logs,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    context.log(`Erro no delay: ${errorMessage}`, 'error');
    logs.push(`Erro: ${errorMessage}`);

    return {
      success: false,
      error: errorMessage,
      logs,
    };
  }
};
