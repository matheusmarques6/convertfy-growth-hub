import {
  NodeExecutor,
  INodeExecutionResult,
  getNestedValue,
  replaceVariables,
} from './types';

type Operator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'greater_equal'
  | 'less_equal'
  | 'is_empty'
  | 'is_not_empty'
  | 'matches_regex';

interface Condition {
  field: string;
  operator: Operator;
  value: string;
}

interface ConditionGroup {
  logic: 'and' | 'or';
  conditions: Condition[];
}

export const conditionExecutor: NodeExecutor = async (nodeData, context) => {
  const {
    conditions = [],
    conditionGroups = [],
    trueNodeId,
    falseNodeId,
  } = nodeData as {
    conditions?: Condition[];
    conditionGroups?: ConditionGroup[];
    trueNodeId?: string;
    falseNodeId?: string;
  };

  const logs: string[] = [];

  try {
    // Avaliar condições simples (legado)
    if (conditions.length > 0 && conditionGroups.length === 0) {
      const allConditionsMet = conditions.every((condition) =>
        evaluateCondition(condition, context.input.variables, context.input.message)
      );

      logs.push(`Condições simples: ${allConditionsMet ? 'TRUE' : 'FALSE'}`);
      context.log(`Condição avaliada: ${allConditionsMet}`);

      return {
        success: true,
        output: { result: allConditionsMet },
        nextNodeId: allConditionsMet ? trueNodeId : falseNodeId,
        logs,
      };
    }

    // Avaliar grupos de condições
    let result = true;

    for (const group of conditionGroups) {
      const groupResults = group.conditions.map((condition) =>
        evaluateCondition(condition, context.input.variables, context.input.message)
      );

      const groupResult =
        group.logic === 'and'
          ? groupResults.every((r) => r)
          : groupResults.some((r) => r);

      logs.push(`Grupo (${group.logic}): ${groupResult}`);
      result = result && groupResult;
    }

    logs.push(`Resultado final: ${result ? 'TRUE' : 'FALSE'}`);
    context.log(`Condição avaliada: ${result}`);

    return {
      success: true,
      output: { result },
      nextNodeId: result ? trueNodeId : falseNodeId,
      logs,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    context.log(`Erro na condição: ${errorMessage}`, 'error');
    logs.push(`Erro: ${errorMessage}`);

    return {
      success: false,
      error: errorMessage,
      logs,
    };
  }
};

function evaluateCondition(
  condition: Condition,
  variables: Record<string, unknown>,
  message?: string
): boolean {
  // Obter valor do campo
  let fieldValue: unknown;

  if (condition.field === 'message' || condition.field === 'input.message') {
    fieldValue = message;
  } else if (condition.field.startsWith('variables.')) {
    const varName = condition.field.replace('variables.', '');
    fieldValue = variables[varName];
  } else {
    fieldValue = getNestedValue(variables, condition.field) ?? variables[condition.field];
  }

  // Substituir variáveis no valor de comparação
  const compareValue = replaceVariables(condition.value, variables);

  // Converter para string para comparação
  const fieldStr = String(fieldValue ?? '');
  const compareStr = String(compareValue);

  switch (condition.operator) {
    case 'equals':
      return fieldStr === compareStr;

    case 'not_equals':
      return fieldStr !== compareStr;

    case 'contains':
      return fieldStr.toLowerCase().includes(compareStr.toLowerCase());

    case 'not_contains':
      return !fieldStr.toLowerCase().includes(compareStr.toLowerCase());

    case 'starts_with':
      return fieldStr.toLowerCase().startsWith(compareStr.toLowerCase());

    case 'ends_with':
      return fieldStr.toLowerCase().endsWith(compareStr.toLowerCase());

    case 'greater_than':
      return Number(fieldValue) > Number(compareValue);

    case 'less_than':
      return Number(fieldValue) < Number(compareValue);

    case 'greater_equal':
      return Number(fieldValue) >= Number(compareValue);

    case 'less_equal':
      return Number(fieldValue) <= Number(compareValue);

    case 'is_empty':
      return !fieldValue || fieldStr.trim() === '';

    case 'is_not_empty':
      return !!fieldValue && fieldStr.trim() !== '';

    case 'matches_regex':
      try {
        const regex = new RegExp(compareStr, 'i');
        return regex.test(fieldStr);
      } catch {
        return false;
      }

    default:
      return false;
  }
}
