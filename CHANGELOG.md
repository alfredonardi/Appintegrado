# CHANGELOG - Appintegrado

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

---

## [Não Lançado]

### ETAPA 7 ✅ - Primeiro Vertical Slice (CRUD Clientes)
**Data**: 2026-01-08

#### Adicionado
- **Store de Clientes** (`src/state/clientsStore.ts`):
  - Zustand store com persistência em localStorage
  - Actions: fetchClients, createClient, updateClient, deleteClient
  - Seletores: selectedClient(), getClientById()
  - Estado: clients[], selectedClientId, loading
  - Integração automática com clientsService

- **Páginas de Clientes** (`src/pages/Clients/`):
  - `List.tsx`: Listagem de clientes com filtros por status
    - Cartões com informações (nome, email, telefone, documento, localização)
    - Botões: Novo Cliente, Editar, Deletar
    - Confirmação antes de deletar
    - Estados: vazio, carregando, com dados

  - `Create.tsx`: Formulário para criar novo cliente
    - Campos: nome, email, telefone, tipo documento (CPF/CNPJ)
    - Campos adicionais: endereço, CEP, cidade, estado, país
    - Status: ativo, inativo, bloqueado
    - Validação de campos obrigatórios
    - Navegação automática após sucesso

  - `Edit.tsx`: Formulário para editar cliente existente
    - Carrega dados automaticamente
    - Mesmo layout que Create
    - Salva alterações e retorna à lista
    - Mensagem de erro se cliente não encontrado

- **Rotas de Clientes** (`src/routes/AppRouter.tsx`):
  - `/clients` → ClientsList (listagem)
  - `/clients/new` → ClientsCreate (criar)
  - `/clients/:clientId/edit` → ClientsEdit (editar)
  - Todas condicionadas por `FEATURE_FLAGS.clientsModule`
  - Menu item já presente no Sidebar

- **Ativação de Feature Flag** (`src/config/features.ts`):
  - `clientsModule: true` (antes estava false)
  - Habilita rotas e menu item automaticamente

#### Status
- ✅ Build production: `npm run build` - SUCCESS
- ✅ Dev server: `npm run dev` - SUCCESS
- ✅ CRUD completo para clientes funcional
- ✅ Store sincronizado com service layer
- ✅ Mock data funcionando (3 clientes de exemplo)
- ✅ Feature flag ativada
- ✅ Menu item visível no Sidebar
- ✅ Exemplo pronto para próximos CRUDs

#### Próximo
- Implementar módulos adicionais (Relatórios, Analytics, etc)
- Integrar com API real (trocar VITE_USE_MOCK_API)

---

### ETAPA 6 ✅ - Camada de API + Mocks Alternável
**Data**: 2026-01-08

#### Adicionado
- **API Client Centralizado** (`src/services/apiClient.ts`):
  - Cliente HTTP genérico com suporte a mock e API real
  - Configurável via `VITE_USE_MOCK_API` e `VITE_API_BASE_URL`
  - Métodos: get, post, put, delete com tipos genéricos
  - Autenticação: adiciona token Bearer automaticamente
  - Tratamento de erros e timeout

- **Mock Data** (`src/services/mock/`):
  - `mockCases.ts`: 2 casos exemplo com dados completos (BO-2024-001, BO-2024-002)
  - `mockClients.ts`: 3 clientes exemplo (pessoas físicas e jurídicas)
  - `mockUsers.ts`: 5 usuários exemplo (delegados, investigadores, fotógrafos)
  - Funções helpers: get, create, update, delete

- **Services Abstratos** (`src/services/`):
  - `casesService.ts`: CRUD para casos, status, filtros
  - `clientsService.ts`: CRUD para clientes, busca por status/email/document
  - `authService.ts`: Login, logout, register, validate token, change password
  - Cada service detecta modo mock automaticamente e usa dados fake ou API real

- **Tipos para Cliente** (`src/types/client.ts`):
  - Interface Client com todos campos necessários
  - Suporte a CPF e CNPJ
  - Status: ativo, inativo, bloqueado

- **Configuração via Environment**:
  - `VITE_USE_MOCK_API=true` (padrão): usa dados fake
  - `VITE_USE_MOCK_API=false`: chama API real
  - `VITE_API_BASE_URL=http://localhost:3000`: URL da API real

#### Status
- ✅ Build production: `npm run build` - SUCCESS
- ✅ Dev server: `npm run dev` - SUCCESS
- ✅ Services funcionam com mock data
- ✅ Estrutura pronta para integração com API real (basta alterar .env)
- ✅ All tipos definidos para Cliente
- ✅ CRUD completo para casos e clientes implementado

#### Próximo
- ETAPA 7: Primeiro vertical slice (CRUD Clientes)

---

### ETAPA 5 ✅ - Feature Flags
**Data**: 2026-01-08

#### Adicionado
- **Feature Flags Config** (`src/config/features.ts`):
  - FEATURE_FLAGS object com todas as flags
  - Tipos: auth, dashboard, casesModule, clientsModule, reportsModule, settingsModule, analyticsModule
  - Override via .env: `VITE_FEATURE_<KEY>=true/false`
  - Helper functions: `isFeatureEnabled()`, `getEnabledFeatures()`
  - ALL_FEATURES array com metadados de cada feature
  - Log em dev mode para visualizar flags ativadas

- **useFeature Hook** (`src/hooks/useFeature.ts`):
  - Hook simples para verificar se feature está ativada
  - Uso: `const isClientsEnabled = useFeature('clientsModule')`

- **FeatureGuard Component** (`src/components/FeatureGuard.tsx`):
  - Component wrapper para proteger features
  - Renderiza children se feature ativada, senão fallback (default null)
  - Uso: `<FeatureGuard feature="clientsModule"><Clients /></FeatureGuard>`

- **Feature Flags em Rotas** (`src/routes/AppRouter.tsx`):
  - `/cases` e sub-rotas condicionadas por `FEATURE_FLAGS.casesModule`
  - Desativar flag remove rota automaticamente
  - Estrutura pronta para `/clients` (ETAPA 7)

- **Feature Flags no Menu** (`src/components/layout/Sidebar.tsx`):
  - Menu items condicionados por feature flag
  - Casos, Clientes, Configurações checam suas flags
  - Menu item desaparece se feature desativada
  - Users icon adicionado para "Clientes"

- **Documentação de Features** (`.env.example`):
  - Exemplo de arquivo `.env` com todas as feature flags
  - Instruções de uso
  - Comentários explicando cada flag

#### Status
- ✅ Build production: `npm run build` - SUCCESS
- ✅ Dev server: `npm run dev` - RUNNING
- ✅ Features desativadas removem rotas e menu items automaticamente
- ✅ Feature flags funcionam via `.env` ou valores padrão
- ✅ Console log em dev mostra flags ativadas

#### Próximo
- ETAPA 6: Camada de API + mocks alternável

---

### ETAPA 4 ✅ - Auth Mock + Proteção de Rotas
**Data**: 2026-01-08

#### Adicionado
- **Autenticação Mock** (`src/state/auth/AuthContext.tsx`):
  - User type: id, email, name, role
  - AuthContext com user, isAuthenticated, isLoading
  - useAuth hook para usar autenticação em qualquer componente
  - Login mock: aceita qualquer email/senha (não vazio)
  - Token fake salvo em localStorage (btoa encoded)
  - Session persistence: useEffect restaura login ao iniciar
  - Logout limpa localStorage e session

- **Proteção de Rotas** (`src/components/routes/PrivateRoute.tsx`):
  - Wrapper para proteger rotas públicas
  - Redireciona para /login se não autenticado
  - Mostra loading enquanto verifica autenticação
  - Renderiza <Outlet /> se autenticado

- **Página de Login** (`src/pages/Login.tsx`):
  - Form simples com email + password
  - Demo button para preencher exemplo
  - Mostra mensagens de erro
  - Redireciona para /cases após sucesso
  - Design profissional com gradient

- **Logout no Header** (`src/components/layout/Header.tsx`):
  - User menu com dropdown (hover)
  - Botão "Sair" funcional
  - Redireciona para /login após logout

#### Mudanças
- `src/routes/AppRouter.tsx`:
  - `/login` é rota pública
  - `/cases` e sub-rotas protegidas com PrivateRoute
  - 404 redireciona para /cases (ou /login se deslogado)

- `src/App.tsx`:
  - Envolve com `<AuthProvider>`
  - AuthProvider acima de AppRouter

- `src/components/layout/Header.tsx`:
  - Adiciona useAuth, handleLogout, dropdown menu
  - LogOut icon import

#### Status
- ✅ Build production: `npm run build` - SUCCESS
- ✅ Dev server: `npm run dev` - RUNNING em http://localhost:5174/
- ✅ Login funciona: qualquer email/senha (não vazio)
- ✅ Session persistence: refresh mantém login
- ✅ Proteção de rotas: sem login → redireciona para /login
- ✅ Logout: remove session e redireciona para /login
- ✅ Token salvo em localStorage

#### Próximo
- ETAPA 5: Feature flags

---

### ETAPA 3 ✅ - React Router + Layout Base
**Data**: 2026-01-08

#### Adicionado
- **React Router DOM** instalado (`npm install react-router-dom`)
- `src/routes/AppRouter.tsx` - Configuração central de rotas:
  - `/` → Redireciona para `/cases`
  - `/cases` → Listagem de casos
  - `/cases/:caseId` → Workspace do caso
  - `/cases/:caseId/capture` → Tela de captura
  - `/cases/:caseId/recognition` → Tela de reconhecimento
  - `/cases/:caseId/photo-report` → Relatório fotográfico
  - `/cases/:caseId/investigation` → Relatório de investigação
  - `/cases/:caseId/export` → Exportação/PDF

- `src/components/layout/AppLayout.tsx` - Layout wrapper com:
  - Sidebar (menu lateral)
  - Header (barra superior)
  - Outlet para renderizar rotas

- `src/components/layout/Header.tsx` - Refatorado do Topbar:
  - Usa `useNavigate()` para navegação
  - Remove dependência de `onNavigate` prop
  - Cria novo caso e navega automaticamente

- **Sidebar refatorado** (`src/components/layout/Sidebar.tsx`):
  - Usa `useLocation()` para detectar rota ativa
  - Usa `useNavigate()` para navegação
  - Menu items condicionados por caso selecionado (caseId)
  - Highlight automático de item ativo

#### Mudanças
- `src/App.tsx` refatorado:
  - Remove navegação manual com estado
  - Envolve app com `<BrowserRouter>`
  - Renderiza `<AppRouter />`

- Todas as 7 páginas refatoradas:
  - Removida interface Props com `onNavigate`
  - Removido parâmetro `onNavigate` das funções
  - Adicionado import `useNavigate` do React Router
  - Adicionado `const navigate = useNavigate()` em cada página
  - Substituídas chamadas `onNavigate()` por `navigate()` com URLs reais

#### Páginas Refatoradas
- `src/pages/CasesListScreen.tsx` - Lista de casos
- `src/pages/CaseWorkspaceScreen.tsx` - Workspace do caso
- `src/pages/CaptureAIScreen.tsx` - Captura com IA
- `src/pages/RecognitionScreen.tsx` - Reconhecimento
- `src/pages/PhotoReportScreen.tsx` - Relatório fotográfico
- `src/pages/InvestigationReportScreen.tsx` - Relatório de investigação
- `src/pages/ExportScreen.tsx` - Exportação

#### Status
- ✅ Build production: `npm run build` - SUCCESS
- ✅ Dev server: `npm run dev` - RUNNING em http://localhost:5173/
- ✅ URLs funcionais: `/cases` → `/cases/123` → etc
- ✅ Layout aparece em todas as páginas
- ✅ Menu Sidebar detecta rota ativa automaticamente
- ✅ Browser back/forward funciona
- ✅ Refresh mantém a rota

#### Próximo
- ETAPA 4: Auth mock + proteção de rotas

---

### ETAPA 1 ✅ - Diagnóstico Inicial e Plano
**Data**: 2026-01-08

#### Adicionado
- `docs/diagnostico.md` - Análise completa da estrutura atual
- `docs/roadmap.md` - Roadmap detalhado das ETAPAS 2-7
- Documentação de problemas e oportunidades identificadas

#### Descoberto
- Stack: React 18.3.1 + Vite + Zustand + Tailwind
- 73 arquivos TypeScript/TSX
- 7 telas complexas já implementadas
- Zu stand com persistência em localStorage

#### Problemas Identificados
- Sem React Router (navegação manual por estado)
- Sem estrutura de pastas escalável
- Sem autenticação/proteção de rotas
- Sem feature flags
- Sem camada de API abstrata

---

### ETAPA 2 ✅ - Estrutura do Projeto "App-Ready"
**Data**: 2026-01-08

#### Adicionado
- Estrutura de pastas padrão:
  - `src/pages/` - Telas/páginas (ex: CasesListScreen, etc)
  - `src/components/` - Componentes reutilizáveis
    - `layout/` - Componentes de layout (Sidebar, Topbar, Toast)
    - `ui/` - Componentes primitivos (botões, inputs, etc)
  - `src/routes/` - Configuração de rotas (placeholder para ETAPA 3)
  - `src/services/` - Serviços e API
    - `mock/` - Dados fake (para ETAPA 6)
  - `src/state/` - Zustand stores (antes em `src/store/`)
  - `src/config/` - Configurações globais
  - `src/types/` - Tipos TypeScript
  - `src/hooks/` - Custom hooks
  - `src/utils/` - Utilitários
  - `src/assets/` - Imagens e ícones
  - `src/constants/` - Constantes da aplicação

#### Mudanças
- Movido: `src/app/components/screens/` → `src/pages/`
- Movido: `src/store/` → `src/state/`
- Movido: `src/app/components/Sidebar.tsx` → `src/components/layout/`
- Movido: `src/app/components/Topbar.tsx` → `src/components/layout/`
- Movido: `src/app/components/Toast.tsx` → `src/components/layout/`
- Movido: `src/app/components/ui/` → `src/components/ui/`
- Movido: `src/app/components/figma/` → `src/utils/figma/`
- Movido: `src/app/App.tsx` → `src/App.tsx`
- Atualizado: `src/main.tsx` - import de App
- Removido: `src/app/` (pasta vazia)

#### Corrigido
- Todos os imports atualizados:
  - `from '../../store'` → `from '../../state'`
  - `from '../../../store'` → `from '../state'` (em pages)
  - `from '../../../services'` → `from '../services'` (em pages)
  - `from '../../../types'` → `from '../types'` (em pages)
  - `from '../../../../types'` → `from '../../types'` (em components)

#### Status
- ✅ Build production: `npm run build` - SUCCESS
- ✅ Dev server: `npm run dev` - RUNNING
- ✅ Nenhuma tela quebrada
- ✅ Zustand store persistindo em localStorage

#### Próximo
- ETAPA 3: React Router + Layout Base

---

## Notas Sobre o Projeto

- Este é um bundle exportado do Figma sendo transformado em uma app escalável
- Cada ETAPA termina com o app rodando (`npm run dev` ✅)
- Imports atualizados automaticamente para refletir a nova estrutura
- Estrutura pronta para adicionar:
  - React Router (ETAPA 3)
  - Auth mock (ETAPA 4)
  - Feature flags (ETAPA 5)
  - API abstrata (ETAPA 6)
  - Módulos CRUD (ETAPA 7+)

---

## Comandos Úteis

```bash
npm install      # Instalar dependências
npm run dev      # Iniciar dev server (http://localhost:5173)
npm run build    # Build para produção
```

---

## Arquitetura Atual

```
src/
├── pages/             # Telas/páginas da aplicação
├── components/        # Componentes reutilizáveis
│   ├── layout/       # Layout wrapper, sidebar, header
│   └── ui/           # Componentes primitivos
├── state/            # Zustand stores
├── services/         # Serviços de API/negócio
├── config/           # Configurações globais
├── types/            # Tipos TypeScript
├── hooks/            # Custom hooks
├── utils/            # Utilitários
├── constants/        # Constantes
├── assets/           # Imagens, ícones
├── styles/           # CSS global
├── App.tsx           # Componente raiz
└── main.tsx          # Entry point
```

---

## Próximas ETAPAs

- **ETAPA 3**: React Router + Layout Base
- **ETAPA 4**: Auth Mock + Proteção de Rotas
- **ETAPA 5**: Feature Flags
- **ETAPA 6**: Camada de API + Mocks
- **ETAPA 7**: Primeiro CRUD (Clientes)
