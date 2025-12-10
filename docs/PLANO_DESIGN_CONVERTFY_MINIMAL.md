# Plano de Execução – Design Minimalista (Referência Klaviyo) para o CRM Convertfy

## Objetivo e premissas
- Adaptar os princípios do Ascent Design System à identidade Convertfy (azul + verde WhatsApp) e ao conjunto de features do WhatsCRM (inbox, flows, broadcasts, contatos, instâncias QR, admin).
- Priorizar simplicidade progressiva: telas com 1 objetivo principal, CTAs únicos por tela, revelação gradual de complexidade (progressive disclosure).
- Garantir consistência entre Figma ↔ tokens ↔ componentes (Tailwind + React), com WCAG 2.1 AA.

## Paleta e tipografia Convertfy (tokens prontos)
- Basear tokens em `src/index.css` (HSL): `--primary` 217/91/60 (azul), `--cta` 142/70/49 (verde WhatsApp), `--accent` 234/89/74 (roxo de apoio), fundos claros com foreground cinza-azulado.
- Uso cromático:
  - CTA primário: `--cta` exclusivo para ações críticas em comunicação (enviar, conectar, iniciar campanha).
  - Ações estruturais: `--primary` para navegação, salvar, confirmar.
  - Feedback: `--success` para status live/entregue, `--destructive` para deletar/pause, `--accent` apenas em metadados/etiquetas.
  - Superfícies: `--card`/`--background`; sombras leves (`--shadow-soft`) sem borda dupla.
- Tipografia: manter Plus Jakarta Sans; 3 tamanhos por tela (14/16/20) com pesos 500/600/700; headings curtos e orientados a ação (“Configurar QR”, “Criar campanha”).

## Layout e navegação
- Shell persistente: sidebar esquerda (agrupada por objetivos: Audience/Engage/Analyze/Configure) + breadcrumbs + tabs contextuais.
- Cabeçalho de página: título + descrição curta + ações primária (única) e secundária (link ghost).
- Grids responsivos: cards em 2-3 colunas desktop, 1 coluna mobile; limite 10 cards por dashboard (Klaviyo-like).
- Estados de densidade: modo compacto opcional para tabelas (menos padding) preservando legibilidade.

## Componentes e padrões críticos
- Botões: primário (`--cta`), secundário contornado (`--primary`), ghost neutro; hover <100ms.
- Inputs: label + descrição opcional + erro inline; estados default/focus/error/success/disabled.
- Cards: header com título + menu ···; corpo livre; footer opcional. Usar `--card` + sombra leve OU borda, nunca ambos.
- Modals: máximo 2 CTAs; título de ação; overlay escuro; botão de fechar sempre visível.
- Tabelas: sorting em header, filtros por chips, paginação (10/25/50), ações em hover de linha, bulk actions em barra superior.
- Empty states: ilustração leve, microcopy de benefício, 1 template sugerido, CTA único.
- Motion: fade/slide discreto; skeleton shimmer para loading; shake sutil em erro.

## Padrões por feature do CRM
- Inbox:
  - Lista de chats com quick-filters (não lidos, atribuídos a mim).
  - Área de mensagens com status (sent/delivered/read) e timeline clara; barra de composer com botão primário `Enviar` (CTA verde).
  - Notificação sonora + badge limão apenas em eventos novos.
- Flow Builder:
  - Canvas com nós tipados (trigger, delay, split, mensagem) e status Draft/Manual/Live (cinza/amarelo/verde).
  - Drop points visuais; zoom/scroll; métrica de entrega exibida no nó (mini badge).
  - Toolbar fixa com ações salvar, publicar (CTA), teste.
- Broadcast:
  - Wizard curto (máx. 4 steps): público → template → agendamento → revisão.
  - Barra lateral com progresso e “Salvar rascunho” sempre visível.
  - Diferenciar estados: Rascunho (cinza), Agendado (azul), Rodando (verde), Pausado (âmbar), Falhou (vermelho).
- Segment Builder:
  - Níveis: condição simples → grupo AND/OR → grupos aninhados. Chips editáveis e removíveis.
  - Campo “Descrever segmento em linguagem natural” (IA) destacado em card secundário.
  - Mostrar resultado estimado (contagem) em tempo real ao lado do CTA “Aplicar”.
- Contatos/Phonebook:
  - Importação CSV com validação inline (detecção automática de tipo: número, data, boolean).
  - Tabelas com chips de filtros ativos e “Clear all”.
- Instâncias QR:
  - Card com status (Connected/Disconnected/Pending) e CTA conectar/reconectar; QR em modal com contagem regressiva.
- Admin:
  - Dashboard executivo com 6-8 KPIs máx; ações rápidas (criar plano/usuário) em cards compactos.

## Onboarding e produtividade
- Checklist inicial (máx. 5 itens) com tempo estimado; unfolding só do primeiro item; “Pular por agora”.
- Percursos por role: Admin (configurações, integrações), Atendente (Inbox, atalhos), Marketing (Broadcast, Templates, Segmentos).
- Atalhos de teclado: novo chat, marcar lido, abrir busca, alternar tema.
- Changelog visível no header do app com badge discreto; link para “O que mudou?”.

## Acessibilidade e microcopy
- Contraste 4.5:1; focus state visível em todos os controles.
- Labels ligados a inputs; headings semânticos; alt text obrigatório.
- Microcopy orientada a benefício (“Envie em massa com segurança”, “Conecte o WhatsApp para começar a atender”).

## Roadmap de execução (4 semanas)
- Semana 1: Revisar tokens (cores, spacing 4/8/12/16/24/32), tipografia, kit de botões/inputs/cards/modals; aplicar shell (sidebar/breadcrumbs/tabs) em páginas principais.
- Semana 2: Tabelas padronizadas, formularios com validação inline, empty states, motion utilitário; dashboard com limite de cards.
- Semana 3: Padrões avançados (Flow Builder, Segment Builder, wizard de Broadcast, multi-step forms com salvar rascunho).
- Semana 4: Onboarding por role, atalhos de teclado, modo compacto de tabelas, checklist de acessibilidade; documentação em Figma + tokens (style-dictionary) ↔ Tailwind.

## Itens de governança e qualidade
- Fonte de verdade em Figma com variantes light/dark; tokens sincronizados com Tailwind.
- Kits de teste visual: histórias em Storybook (estados default/focus/error/success/disabled) para Button/Input/Card/Modal/Table/EmptyState.
- Limite de 1 CTA primário por tela; no máximo 3 tamanhos de fonte por página; dashboards ≤10 cards; modals ≤2 CTAs.
- Releases de UI comunicadas via changelog integrado; evitar mudanças frequentes sem aviso.
