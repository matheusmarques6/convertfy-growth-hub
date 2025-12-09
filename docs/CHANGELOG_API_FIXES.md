# Changelog - Correções de API e Integração

**Data:** 2025-12-09
**Versão:** 1.1.0

---

## Resumo

Este documento descreve as correções realizadas para resolver problemas de integração entre o frontend (React/Vite) e o backend (Node.js/Express) do sistema Convertfy Growth Hub / WhatsCRM.

---

## Problemas Identificados

### 1. API de Planos Retornando HTML em vez de JSON

**Sintoma:** As páginas de Planos (tanto do usuário `/plans` quanto do admin `/admin/plans`) não carregavam dados - mostravam tela em branco ou erro.

**Causa Raiz:** O Express estava configurado com um catch-all `app.get("*")` que capturava TODAS as requisições GET, incluindo rotas de API como `/api/plans`. Isso fazia com que o servidor retornasse o `index.html` do frontend em vez da resposta JSON da API.

**Arquivo Afetado:** `whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system/app.js`

### 2. Erro "plans.map is not a function"

**Sintoma:** Após corrigir o problema anterior, a API retornava erro: `{"success":false,"message":"Error fetching plans","error":"plans.map is not a function"}`

**Causa Raiz:** A função `query()` no arquivo `dbpromise.js` retornava a string `"No sql provided"` quando chamada sem o segundo parâmetro (array de valores). Como as queries de planos não tinham parâmetros, o retorno era uma string em vez de um array.

**Arquivo Afetado:** `whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system/database/dbpromise.js`

### 3. AdminPlans Usando Dados Hardcoded

**Sintoma:** A página de administração de planos mostrava apenas 3 planos fixos em vez dos dados reais do banco.

**Causa Raiz:** O componente `AdminPlans.tsx` estava usando um array estático em vez de chamar a API.

**Arquivo Afetado:** `src/pages/admin/AdminPlans.tsx`

---

## Correções Aplicadas

### Correção 1: Rota Catch-All do Express

**Arquivo:** `whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system/app.js`

**Antes:**
```javascript
app.get("*", function (request, response) {
  response.sendFile(path.resolve(currentDir, "./client/public", "index.html"));
});
```

**Depois:**
```javascript
app.get("*", function (request, response) {
  // Skip API routes - let them 404 if not found
  if (request.path.startsWith('/api/')) {
    return response.status(404).json({ success: false, message: 'API route not found' });
  }
  response.sendFile(path.resolve(currentDir, "./client/public", "index.html"));
});
```

**Impacto:** Rotas de API agora são processadas corretamente pelos seus respectivos handlers, e apenas rotas não-API são redirecionadas para o frontend SPA.

---

### Correção 2: Função Query do Banco de Dados

**Arquivo:** `whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system/database/dbpromise.js`

**Antes:**
```javascript
function query(sql, arr) {
  return new Promise((resolve, reject) => {
    if (!sql || !arr) {
      return resolve("No sql provided");
    }
    // ...
  });
}
```

**Depois:**
```javascript
function query(sql, arr = []) {
  return new Promise((resolve, reject) => {
    if (!sql) {
      return resolve([]);
    }
    // ...
  });
}
```

**Impacto:** Queries sem parâmetros agora funcionam corretamente, retornando um array vazio em vez de uma string quando não há SQL.

---

### Correção 3: Integração AdminPlans com API

**Arquivo:** `src/pages/admin/AdminPlans.tsx`

**Mudanças:**
- Removido array hardcoded de planos
- Adicionado `useQuery` do React Query para buscar dados da API
- Adicionado estado de loading com spinner
- Formatação de preços em BRL
- Exibição de limites (contatos, mensagens, instâncias)
- Badge para planos com trial
- Ícone de coroa para planos populares

**Código Adicionado:**
```typescript
import { useQuery } from "@tanstack/react-query";
import plansService, { Plan } from "@/services/plans";

const { data: plans = [], isLoading } = useQuery({
  queryKey: ['admin-plans'],
  queryFn: plansService.getPlans,
});
```

---

## Arquivos Modificados

| Arquivo | Tipo de Mudança |
|---------|-----------------|
| `whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system/app.js` | Correção de roteamento |
| `whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system/database/dbpromise.js` | Correção de função |
| `src/pages/admin/AdminPlans.tsx` | Integração com API |

---

## Resultado

Após as correções:

1. **API `/api/plans`** retorna JSON corretamente com 5 planos:
   - Free (Grátis)
   - Starter (R$ 49,90/mês)
   - Professional (R$ 149,90/mês) - Popular
   - Business (R$ 399,90/mês)
   - Enterprise (Sob consulta)

2. **Página de Planos do Usuário** (`/plans`) carrega e exibe todos os planos disponíveis.

3. **Página de Planos do Admin** (`/admin/plans`) carrega e exibe todos os planos com informações detalhadas.

---

## Teste de Validação

```bash
# Testar API de planos
curl -s "http://localhost:8001/api/plans" -H "Content-Type: application/json"

# Resultado esperado:
# {"success":true,"data":[{"plan_id":"free","name":"Free",...},{"plan_id":"starter",...},...]}
```

---

## Arquitetura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │    Backend      │     │    MySQL        │
│   (React)       │────▶│    (Express)    │────▶│    Database     │
│   Port: 8080    │     │    Port: 8001   │     │    Port: 3306   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │  GET /api/plans       │
        │──────────────────────▶│
        │                       │  SELECT * FROM plans
        │                       │─────────────────────▶
        │                       │◀─────────────────────
        │◀──────────────────────│
        │  JSON Response        │
```

---

## Próximos Passos

1. **Sistema de Gatilhos (Triggers)** - Implementar nós de gatilho no Flow Builder
2. **Webhook de E-commerce** - Endpoint para receber eventos de carrinho abandonado
3. **Testes End-to-End** - Validar fluxo completo de criação de chatbots

---

## Notas Técnicas

- O frontend roda em modo desenvolvimento com Vite (HMR habilitado)
- O backend usa nodemon para auto-reload em desenvolvimento
- A comunicação entre frontend e backend usa proxy configurado no Vite ou chamadas diretas ao `localhost:8001`
- O serviço de API (`src/services/api.ts`) deve ter o `baseURL` configurado para `http://localhost:8001/api`
