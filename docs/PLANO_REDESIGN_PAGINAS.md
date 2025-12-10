# Plano de Redesign por Página (Convertfy CRM) – alinhado ao guia e paleta

Objetivo: aplicar o guia minimalista adaptado (azul `--primary`, verde WhatsApp `--cta`, roxo `--accent`, superfícies claras `--card`) em todas as páginas, exceto landing (`src/pages/Index.tsx`). Princípios: 1 CTA primário por tela, 3 tamanhos de fonte, revelação progressiva, tokens existentes de `src/index.css`.

## Base transversal (aplicar antes de tocar páginas)
- Shell comum: sidebar com grupos por objetivo, breadcrumbs, tabs contextuais.
- Tokens e componentes: usar botões primário (`--cta`), secundário (`--primary` contornado), ghost neutro; inputs com estados focus/erro/sucesso; cards com ··· e sombra leve OU borda.
- Estados: skeleton load, empty states com CTA único, toasts de sucesso/erro, focus visível (WCAG).
- Densidade: modo compacto opcional em tabelas; spacing escala 4/8/12/16/24/32.

## Autenticação (`src/pages/public/Login.tsx`, `Register.tsx`, `ResetPassword.tsx`)
- Cards centrais claros; CTA verde; links ghost.
- Validação inline; mensagens de erro/sucesso; microcopy orientada a benefício.
- Reset: steps (Email → Código → Nova senha) com progresso textual.

## Dashboard (`src/pages/dashboard/Dashboard.tsx`)
- Máx. 10 cards; variação % com setas coloridas (verde/verm); filtros de período com granularidade auto.
- Grid 2-3 colunas desktop; empty state com CTA criar campanha/fluxo.
- CTA principal azul ou verde conforme ação (comunicação = verde; estrutural = azul).

## Inbox (`src/pages/inbox/Inbox.tsx`)
- Lista de chats com chips (Não lidos/Meus/Todos) usando azul/roxo neutro; badges mínimos.
- Painel mensagens com estados sent/delivered/read; composer com CTA verde “Enviar”.
- Som + badge limão só em novos eventos; skeleton para loading; ações em hover.

## Chatbots (`src/pages/chatbots/Chatbots.tsx`)
- Cards/tabela com status Draft/Live em cinza/verde; menu ··· para editar/ativar/desativar.
- Modal criar/editar com validação inline; CTA azul (salvar) e ghost (cancelar).

## Flow Builder (`src/pages/flow/FlowBuilder.tsx`)
- Canvas com nós tipados e status (cinza/amarelo/verde); toolbar fixa (Salvar azul, Publicar verde, Testar ghost).
- Drop points visíveis; zoom/minimapa; painel lateral com inputs padronizados.
- Mini-métricas no nó (badge roxo/acento).

## Broadcast (`src/pages/broadcast/Broadcast.tsx`, `CampaignDetail.tsx`)
- Wizard 4 steps com barra lateral de progresso; “Salvar rascunho” sempre visível.
- Estados de campanha: Rascunho cinza, Agendado azul, Rodando verde, Pausado âmbar, Falhou vermelho.
- Detalhe com tabs (Visão geral/Logs/Estatísticas); gráficos com auto-granularidade; CTA principal verde para iniciar.

## Contacts (`src/pages/contacts/Contacts.tsx`)
- Tabela com sorting + chips de filtros; paginação 10/25/50; ações em hover.
- Import CSV com detecção automática de tipo; erros por coluna; CTA verde “Importar”.
- Empty state com template CSV e CTA único.

## Phonebook (`src/pages/phonebook/Phonebook.tsx`)
- Cards/tabela com contagem; filtros por owner/uso; ações via ···.
- Modal criar/editar lista; CTA azul salvar, ghost cancelar.

## Agents (`src/pages/agents/Agents.tsx`)
- Tabela com status (Ativo/Inativo) e carga de chats; bulk actions ativar/desativar.
- Modal atribuir chat; badges de role/skill em roxo/acento.

## Instances QR (`src/pages/instances/Instances.tsx`)
- Cards com status Connected/Disconnected/Pending; CTA verde conectar/reconectar.
- Modal QR com contagem regressiva e instruções curtas; alerta de desconexão âmbar.

## Templates (`src/pages/templates/Templates.tsx`)
- Lista/tabela com status aprovado/pending/rejected; filtros por categoria; pré-visualização lateral.
- Modais criar/sincronizar; CTA azul salvar, verde sincronizar envio.

## Plans (`src/pages/plans/Plans.tsx`)
- Cards comparativos; destacar plano atual; CTA verde “Selecionar”.
- Tabela de limites compacta; alerta de upgrade em amarelo/âmbar.

## Settings (`src/pages/settings/Settings.tsx`)
- Tabs (Perfil, Segurança, Meta API, Timezone); formulários com validação inline.
- CTA salvar azul, cancelar ghost; toasts de sucesso; avisos de risco em vermelho/destructive.

## Admin (`src/pages/admin/AdminDashboard.tsx`, `AdminUsers.tsx`, `AdminPlans.tsx`, `AdminSettings.tsx`)
- Dashboard: 6-8 KPIs; cards com ações rápidas (azul/verde conforme tipo).
- Users: tabela com busca/filtros, bulk actions; modal CRUD padronizado.
- Plans: tabela + modal; status por badge; logs de mudança.
- Settings: formulários com alerts destrutivos para ações de risco; confirmar em modal.

## NotFound (`src/pages/NotFound.tsx`)
- Empty state com ilustração leve e CTA “Voltar ao dashboard” (azul).

## Sequência de execução acordada
- Dashboard → Inbox
- Chatbots → Flow Builder
- Broadcast (wizard + detail) → Contacts → Phonebook
- Agents → Instances QR
- Templates → Plans
- Settings
- Admin (Dashboard, Users, Plans, Settings)
- NotFound (ajuste final)
