# PLANO DE INTEGRAÇÃO - Frontend Convertfy + Backend WhatsCRM

## Visão Geral

**Objetivo:** Integrar o frontend React (convertfy-growth-hub) com o backend Node.js (WhatsCRM) para criar um CRM de WhatsApp funcional completo.

**Estado Atual:**
- Frontend: 89 componentes TSX criados com dados mockados
- Backend: WhatsCRM v3.6 completo e funcional
- Integração: Nenhuma (dados hardcoded no frontend)

---

## FASE 1: Configuração do Ambiente (Estimativa: 1-2 horas)

### 1.1 Configurar Backend WhatsCRM

**Localização:** `/home/convertfy/projetos/whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system/`

**Tarefas:**

- [ ] **1.1.1** Criar banco de dados MySQL
  ```bash
  mysql -u root -p
  CREATE DATABASE whatscrm_db;
  ```

- [ ] **1.1.2** Importar schema SQL
  ```bash
  mysql -u root -p whatscrm_db < database/import.sql
  ```

- [ ] **1.1.3** Configurar arquivo `.env`
  ```env
  HOST=127.0.0.1
  PORT=3010
  DBHOST=localhost
  DBNAME=whatscrm_db
  DBUSER=seu_usuario
  DBPASS=sua_senha
  DBPORT=3306
  JWTKEY=chave_secreta_forte_aqui
  FRONTENDURI=http://localhost:5173
  BACKURI=http://localhost:3010
  ```

- [ ] **1.1.4** Instalar dependências do backend
  ```bash
  cd /home/convertfy/projetos/whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system
  npm install
  ```

- [ ] **1.1.5** Testar backend
  ```bash
  npm start
  # Deve mostrar: "WaCrm server is running on port 3010"
  ```

### 1.2 Configurar Frontend

**Localização:** `/home/convertfy/projetos/convertfy-growth-hub/`

**Tarefas:**

- [ ] **1.2.1** Criar arquivo de configuração de ambiente
  ```
  Criar: src/config/env.ts
  ```

- [ ] **1.2.2** Instalar dependências adicionais
  ```bash
  npm install axios socket.io-client zustand @tanstack/react-query
  ```

- [ ] **1.2.3** Configurar variáveis de ambiente
  ```
  Criar: .env.local
  VITE_API_URL=http://localhost:3010/api
  VITE_SOCKET_URL=http://localhost:3010
  ```

---

## FASE 2: Camada de Serviços (Estimativa: 3-4 horas)

### 2.1 Criar Estrutura de Serviços

**Criar pasta:** `src/services/`

### 2.2 Serviço de API (Axios)

**Criar arquivo:** `src/services/api.ts`

**Funcionalidades:**
- [ ] Instância Axios com baseURL configurável
- [ ] Interceptor para adicionar token JWT automaticamente
- [ ] Interceptor para tratar erros e logout automático
- [ ] Tipagem TypeScript para todas as respostas

**Formato de resposta do backend:**
```typescript
// Sucesso
{ success: true, data: any, msg?: string }

// Erro
{ success: false, msg: string }

// Logout forçado
{ success: false, logout: true }
```

### 2.3 Serviço de Socket.IO

**Criar arquivo:** `src/services/socket.ts`

**Funcionalidades:**
- [ ] Conexão com autenticação JWT
- [ ] Reconexão automática
- [ ] Eventos a implementar:
  - `connection_ack` - Confirmação de conexão
  - `new_message` - Nova mensagem recebida
  - `message_status` - Status de mensagem (sent/delivered/read)
  - `ring` - Som de notificação
  - `qr_code` - QR Code gerado
  - `qr_connected` - WhatsApp conectado
  - `qr_disconnected` - WhatsApp desconectado
  - `request_update_chat_list` - Atualizar lista de chats

### 2.4 Serviços por Módulo

**Criar arquivos:**

| Arquivo | Endpoints |
|---------|-----------|
| `src/services/auth.ts` | Login, Register, Reset Password, Profile |
| `src/services/chats.ts` | GET /inbox/*, POST /inbox/* |
| `src/services/chatbots.ts` | GET/POST /chatbot/* |
| `src/services/flows.ts` | GET/POST /chat_flow/* |
| `src/services/broadcast.ts` | GET/POST /broadcast/* |
| `src/services/contacts.ts` | GET/POST /user/contacts, /phonebook/* |
| `src/services/agents.ts` | GET/POST /agent/* |
| `src/services/instances.ts` | GET/POST /qr/* |
| `src/services/templates.ts` | GET/POST /templet/* |
| `src/services/admin.ts` | GET/POST /admin/* |

---

## FASE 3: Estado Global (Estimativa: 2-3 horas)

### 3.1 Configurar Zustand

**Criar pasta:** `src/store/`

### 3.2 Stores a Criar

| Store | Responsabilidade |
|-------|------------------|
| `src/store/authStore.ts` | Token JWT, dados do usuário, login/logout |
| `src/store/chatStore.ts` | Chats, mensagens, chat ativo |
| `src/store/uiStore.ts` | Sidebar, modais, notificações |
| `src/store/socketStore.ts` | Status de conexão, eventos |

### 3.3 Persistência

- [ ] Usar `zustand/middleware` para persistir token no localStorage
- [ ] Implementar hidratação do estado ao carregar app

---

## FASE 4: Hooks Customizados (Estimativa: 2-3 horas)

### 4.1 Hooks a Criar

| Hook | Funcionalidade |
|------|----------------|
| `src/hooks/useAuth.ts` | Login, logout, verificar autenticação |
| `src/hooks/useSocket.ts` | Conexão, eventos, reconexão |
| `src/hooks/useChats.ts` | Lista de chats, mensagens, envio |
| `src/hooks/useChatbots.ts` | CRUD chatbots |
| `src/hooks/useFlows.ts` | CRUD fluxos |
| `src/hooks/useBroadcast.ts` | CRUD campanhas |
| `src/hooks/useContacts.ts` | CRUD contatos |
| `src/hooks/useAgents.ts` | CRUD agentes |
| `src/hooks/useInstances.ts` | CRUD instâncias QR |

### 4.2 Integrar React Query

- [ ] Configurar QueryClient
- [ ] Implementar caching de dados
- [ ] Invalidação automática após mutações

---

## FASE 5: Integração por Página (Estimativa: 8-12 horas)

### 5.1 Autenticação (Prioridade: ALTA)

**Páginas:** Login, Register, Reset Password

**Tarefas:**
- [ ] Conectar formulário de login à API `/api/user/login`
- [ ] Armazenar token JWT no localStorage
- [ ] Implementar redirect após login
- [ ] Conectar registro à API `/api/user/register`
- [ ] Implementar reset de senha

**Endpoints:**
```
POST /api/user/login
POST /api/user/register
POST /api/user/reset-password
POST /api/user/verify-otp
POST /api/user/new-password
```

### 5.2 Dashboard (Prioridade: ALTA)

**Página:** Dashboard

**Tarefas:**
- [ ] Buscar métricas do usuário
- [ ] Exibir contagem de chats, contatos, campanhas
- [ ] Gráficos de atividade

**Endpoints:**
```
GET /api/user/get-profile
GET /api/inbox/get-chats (para contagem)
GET /api/broadcast/get-campaigns (para contagem)
```

### 5.3 Inbox (Prioridade: ALTA)

**Página:** Inbox

**Tarefas:**
- [ ] Listar chats reais da API
- [ ] Exibir mensagens do chat selecionado
- [ ] Enviar mensagens via API
- [ ] Conectar Socket.IO para tempo real
- [ ] Implementar notificações sonoras
- [ ] Marcar mensagens como lidas

**Endpoints:**
```
GET  /api/inbox/get-chats
GET  /api/inbox/get-messages/:chatId
POST /api/inbox/send-message
POST /api/inbox/mark-as-read
```

**Socket Events:**
```
new_message
message_status
ring
request_update_chat_list
```

### 5.4 Chatbots (Prioridade: MÉDIA)

**Página:** Chatbots

**Tarefas:**
- [ ] Listar chatbots do usuário
- [ ] Criar novo chatbot
- [ ] Editar chatbot existente
- [ ] Ativar/desativar chatbot
- [ ] Excluir chatbot

**Endpoints:**
```
GET  /api/chatbot/get-chatbots
GET  /api/chatbot/get-chatbot/:id
POST /api/chatbot/add-chatbot
POST /api/chatbot/update-chatbot
POST /api/chatbot/delete-chatbot
POST /api/chatbot/toggle-chatbot
```

### 5.5 Flow Builder (Prioridade: MÉDIA)

**Página:** Flow Editor

**Tarefas:**
- [ ] Listar fluxos do usuário
- [ ] Carregar nós e arestas do fluxo
- [ ] Salvar alterações no fluxo
- [ ] Criar novo fluxo
- [ ] Excluir fluxo

**Endpoints:**
```
GET  /api/chat_flow/get-flows
GET  /api/chat_flow/get-flow/:flowId
GET  /api/chat_flow/get-nodes/:flowId
GET  /api/chat_flow/get-edges/:flowId
POST /api/chat_flow/add-flow
POST /api/chat_flow/update-flow
POST /api/chat_flow/save-nodes
POST /api/chat_flow/save-edges
POST /api/chat_flow/delete-flow
```

### 5.6 Broadcast (Prioridade: MÉDIA)

**Página:** Broadcast

**Tarefas:**
- [ ] Listar campanhas
- [ ] Criar nova campanha
- [ ] Selecionar phonebook
- [ ] Selecionar template
- [ ] Agendar envio
- [ ] Ver logs e estatísticas

**Endpoints:**
```
GET  /api/broadcast/get-campaigns
GET  /api/broadcast/get-campaign/:id
GET  /api/broadcast/get-campaign-logs/:id
GET  /api/broadcast/get-campaign-stats/:id
POST /api/broadcast/add-campaign
POST /api/broadcast/update-campaign
POST /api/broadcast/start-campaign
POST /api/broadcast/pause-campaign
POST /api/broadcast/delete-campaign
```

### 5.7 Contatos (Prioridade: MÉDIA)

**Páginas:** Contacts, Phonebook

**Tarefas:**
- [ ] Listar contatos
- [ ] Adicionar contato
- [ ] Editar contato
- [ ] Excluir contato
- [ ] Importar CSV
- [ ] Gerenciar phonebooks

**Endpoints:**
```
GET  /api/user/get-contacts
POST /api/user/add-contact
POST /api/user/update-contact
POST /api/user/delete-contact
POST /api/user/import-contacts
GET  /api/phonebook/get-phonebooks
POST /api/phonebook/add-phonebook
```

### 5.8 Agentes (Prioridade: BAIXA)

**Página:** Agents

**Tarefas:**
- [ ] Listar agentes
- [ ] Criar agente
- [ ] Editar agente
- [ ] Excluir agente
- [ ] Atribuir chats

**Endpoints:**
```
GET  /api/agent/get-agents
POST /api/agent/add-agent
POST /api/agent/update-agent
POST /api/agent/delete-agent
POST /api/agent/assign-chat
POST /api/agent/transfer-chat
```

### 5.9 Instâncias QR (Prioridade: MÉDIA)

**Página:** Instances

**Tarefas:**
- [ ] Listar instâncias
- [ ] Criar nova instância
- [ ] Exibir QR Code para escaneamento
- [ ] Monitorar status de conexão
- [ ] Desconectar/reconectar

**Endpoints:**
```
GET  /api/qr/get-instances
POST /api/qr/create-instance
POST /api/qr/delete-instance
GET  /api/qr/get-qr/:instanceId
POST /api/qr/connect
POST /api/qr/disconnect
GET  /api/qr/get-status/:id
```

**Socket Events:**
```
qr_code
qr_connected
qr_disconnected
```

### 5.10 Templates (Prioridade: BAIXA)

**Página:** Templates

**Tarefas:**
- [ ] Listar templates Meta
- [ ] Criar novo template
- [ ] Sincronizar com Meta

**Endpoints:**
```
GET  /api/templet/get-templates
POST /api/templet/create-template
POST /api/templet/sync-templates
```

### 5.11 Configurações (Prioridade: MÉDIA)

**Página:** Settings

**Tarefas:**
- [ ] Exibir perfil do usuário
- [ ] Atualizar perfil
- [ ] Alterar senha
- [ ] Configurar Meta API keys
- [ ] Configurar timezone

**Endpoints:**
```
GET  /api/user/get-profile
POST /api/user/update-profile
POST /api/user/update-password
GET  /api/user/get-meta-keys
POST /api/user/save-meta-keys
POST /api/user/update-timezone
```

### 5.12 Admin (Prioridade: BAIXA)

**Páginas:** Admin Dashboard, Users, Plans, Settings

**Tarefas:**
- [ ] Dashboard com métricas globais
- [ ] CRUD de usuários
- [ ] CRUD de planos
- [ ] Configurações globais (SMTP, Pagamentos)

**Endpoints:**
```
GET  /api/admin/get-users
POST /api/admin/add-user
POST /api/admin/update-user
POST /api/admin/delete-user
GET  /api/admin/get-plans
POST /api/admin/add-plan
POST /api/admin/update-plan
GET  /api/admin/get-smtp
POST /api/admin/update-smtp
```

---

## FASE 6: Proteção de Rotas (Estimativa: 1-2 horas)

### 6.1 Criar Componentes de Proteção

**Criar arquivos:**
- [ ] `src/components/auth/PrivateRoute.tsx` - Rotas autenticadas
- [ ] `src/components/auth/PublicRoute.tsx` - Rotas públicas (redirect se logado)
- [ ] `src/components/auth/AdminRoute.tsx` - Rotas de admin

### 6.2 Implementar Verificações

- [ ] Verificar token válido no localStorage
- [ ] Verificar role do usuário (user/admin/agent)
- [ ] Redirect para login se não autenticado
- [ ] Redirect para dashboard se tentar acessar login estando logado

---

## FASE 7: Build e Deploy (Estimativa: 1-2 horas)

### 7.1 Build do Frontend

```bash
cd /home/convertfy/projetos/convertfy-growth-hub
npm run build
```

### 7.2 Mover Build para Backend

```bash
# Backup do frontend antigo
mv /home/convertfy/projetos/whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system/client/public \
   /home/convertfy/projetos/whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system/client/public_backup

# Copiar novo build
cp -r /home/convertfy/projetos/convertfy-growth-hub/dist \
   /home/convertfy/projetos/whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system/client/public
```

### 7.3 Testar Integração

```bash
cd /home/convertfy/projetos/whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system
npm start
# Acessar http://localhost:3010
```

---

## ORDEM DE EXECUÇÃO RECOMENDADA

### Sprint 1 - Fundação (Dias 1-2)
1. ✅ Fase 1 - Configuração do Ambiente
2. ✅ Fase 2 - Camada de Serviços (api.ts, socket.ts)
3. ✅ Fase 3 - Estado Global (authStore)
4. ✅ Fase 5.1 - Autenticação

### Sprint 2 - Core (Dias 3-5)
5. ✅ Fase 5.2 - Dashboard
6. ✅ Fase 5.3 - Inbox (mais complexo)
7. ✅ Fase 4 - Hooks (useAuth, useSocket, useChats)

### Sprint 3 - Features (Dias 6-8)
8. ✅ Fase 5.4 - Chatbots
9. ✅ Fase 5.5 - Flow Builder
10. ✅ Fase 5.6 - Broadcast

### Sprint 4 - Complementos (Dias 9-10)
11. ✅ Fase 5.7 - Contatos
12. ✅ Fase 5.8 - Agentes
13. ✅ Fase 5.9 - Instâncias QR

### Sprint 5 - Finalização (Dias 11-12)
14. ✅ Fase 5.10 - Templates
15. ✅ Fase 5.11 - Configurações
16. ✅ Fase 5.12 - Admin
17. ✅ Fase 6 - Proteção de Rotas
18. ✅ Fase 7 - Build e Deploy

---

## RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Formato de resposta diferente do esperado | Média | Alto | Criar tipos TypeScript baseados em testes reais |
| Socket.IO não conecta | Baixa | Alto | Testar conexão isoladamente primeiro |
| CORS bloqueando requisições | Média | Médio | Backend já tem cors() configurado |
| Banco de dados não configurado | Alta | Alto | Primeira tarefa é configurar banco |
| Endpoints retornando erros | Média | Médio | Testar cada endpoint no Postman primeiro |

---

## CHECKLIST FINAL

- [ ] Backend rodando na porta 3010
- [ ] Banco de dados criado e populado
- [ ] Frontend conectando à API
- [ ] Socket.IO funcionando
- [ ] Login/Logout funcionando
- [ ] Inbox recebendo mensagens em tempo real
- [ ] Todas as páginas integradas
- [ ] Build gerado e testado
- [ ] Deploy concluído

---

## NOTAS IMPORTANTES

1. **Sempre testar endpoints no Postman/Insomnia antes de integrar**
2. **Manter console.log durante desenvolvimento para debug**
3. **Commitar frequentemente com mensagens descritivas**
4. **Criar branch separada para integração**
5. **Testar em dispositivo móvel após cada fase**

---

*Documento criado em: Dezembro 2024*
*Versão: 1.0*
