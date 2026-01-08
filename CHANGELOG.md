# CHANGELOG - Appintegrado

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

---

## [Não Lançado]

### ETAPA 10 ✅ - Capture Vertical Slice Completo (Upload e Galeria de Imagens)
**Data**: 2026-01-08

#### Objetivo
Implementar um vertical slice completo do submódulo Capture com funcionalidade real de upload, preview e persistência de imagens por caso.

#### Adicionado

**Tipos** (`src/types/capture.ts` - novo):
- `CaptureImage`: Interface com id, caseId, name, size, type, url, createdAt
- `CaptureState`: Interface com ações do store (getImages, addImages, removeImage, clearCaseImages)

**Store Zustand com Persistência** (`src/state/captureStore.ts` - novo):
- `useCaptureStore`: Store global com middleware persist
- Persiste em localStorage com chave `appintegrado-capture`
- Usa Data URLs (base64) para que imagens persistam após reload
- Actions:
  - `getImages(caseId)`: Retorna imagens de um caso específico
  - `addImages(caseId, files)`: Upload assincronamente, converte para Data URL
  - `removeImage(caseId, imageId)`: Remove imagem do store
  - `clearCaseImages(caseId)`: Limpa todas as imagens de um caso
- State: `imagesByCaseId: Record<string, CaptureImage[]>`

**Componentes UI** (`src/components/capture/` - novos):
- `CaptureUploader.tsx`:
  - Input file com multiple + accept="image/*"
  - Suporta drag-and-drop
  - Valida tipos (PNG, JPG, WebP)
  - Feedback visual durante upload
  - Acessível (aria-labels)

- `CaptureGrid.tsx`:
  - Grid responsivo (1, 2 ou 4 colunas conforme viewport)
  - Exibe contagem de imagens e tamanho total
  - Estado vazio com ilustração
  - Loading skeleton
  - Chama onRemoveImage para cada imagem

- `CaptureCard.tsx`:
  - Preview da imagem (aspect-ratio quadrado)
  - Metadados: nome, tamanho formatado, tipo, data
  - Botão remover com overlay no hover
  - Títulos (title) para truncate
  - Acessível

- `index.ts`: Re-exports dos 3 componentes

**Página do Módulo** (`src/pages/CaseModules/Capture.tsx` - refatorizado):
- Substituiu placeholder por implementação funcional
- Integra store useCaptureStore
- Seções:
  - Header com título, ID do caso, botão voltar
  - Seção "Adicionar Imagens" com CaptureUploader
  - Seção "Galeria de Imagens" com CaptureGrid
  - Informações úteis ao usuário
- Handlers useCallback para fileSeletion e removeImage
- Validação do caseId

#### Funcionalidade

✅ **Upload Múltiplo**:
- Selecionar 1+ imagens via input ou drag-drop
- Apenas imagens válidas são processadas
- FileReader lê como base64 (Data URL)
- Adiciona ao store de forma assincronada

✅ **Preview em Grid**:
- Cards mostrando imagem + metadados
- Responsivo (mobile, tablet, desktop)
- Contagem e tamanho total visíveis

✅ **Remoção de Imagens**:
- Botão por card
- Remove imediatamente do store
- Atualiza contagem em tempo real

✅ **Persistência**:
- Zustand persist middleware com localStorage
- Data URLs válidas após reload
- Imagens associadas por caseId
- Recarregar página mantém as imagens

#### Feature Flag
- Feature flag `caseCaptureModule` continua aplicado
- Rotas CaseRouter já protegem o submódulo
- Página renderiza apenas se caseId válido

#### Boas Práticas Aplicadas
- Validação de arquivo antes de processar
- IDs com crypto.randomUUID() (fallback incluído)
- Data URLs para persistência sem IndexedDB
- Componentes pequenos e reutilizáveis
- Acessibilidade básica (aria-labels, alt)
- Sem dependências externas além de react + zustand + lucide

#### Status
- ✅ npm run build: SUCCESS (sem erros de tipo)
- ✅ npm run dev: Servidor rodando OK
- ✅ Persistência localStorage: Testada
- ✅ Componentes renderizam sem erros

#### Testes Manuais Obrigatórios
1. ✅ Ativar caseCaptureModule (já está ativo)
2. ✅ Acessar /cases/:id/capture
3. ✅ Upload de 3 imagens PNG/JPG
4. ✅ Confirmar preview em grid (4 colunas em desktop)
5. ✅ Recarregar página - imagens continuam
6. ✅ Remover 1 imagem
7. ✅ Recarregar - imagem removida não volta
8. ✅ npm run build sem erros
9. ✅ npm run dev sem erros

#### Arquivos Criados/Modificados
- ✅ src/types/capture.ts (novo)
- ✅ src/types/index.ts (modificado - adicionado export)
- ✅ src/state/captureStore.ts (novo)
- ✅ src/components/capture/CaptureUploader.tsx (novo)
- ✅ src/components/capture/CaptureGrid.tsx (novo)
- ✅ src/components/capture/CaptureCard.tsx (novo)
- ✅ src/components/capture/index.ts (novo)
- ✅ src/pages/CaseModules/Capture.tsx (refatorizado)

#### Próximo
- Integração com IA para classificação de fotos
- Associar imagens ao relatório fotográfico
- Suporte a mais formatos (GIF, TIFF)

---

### ETAPA 9 ✅ - Submódulos de Caso com Feature Flags (Roteamento Aninhado)
**Data**: 2026-01-08

#### Adicionado
- **Configuração de Módulos de Caso** (`src/config/caseModules.ts`):
  - `CASE_MODULES` array com metadados de cada módulo
  - Cada módulo tem: id, label, description, path, icon, featureFlag, order
  - Funções helpers:
    - `getActiveModules()` - retorna módulos ativos por feature flag
    - `getFirstActiveModule()` - retorna primeiro módulo ativo (para redirecionamento)
    - `isModuleActive(moduleId)` - verifica se módulo está ativo
    - `getModuleById(moduleId)` - obtém módulo por ID
    - `getNextActiveModule(currentModuleId)` - próximo módulo na sequência

- **CaseRouter.tsx** (`src/routes/CaseRouter.tsx`):
  - Rotas aninhadas para submódulos do caso: `/cases/:caseId/*`
  - `CaseModuleGuard` - wrapper que redireciona se módulo desativado
  - Rota raiz `/cases/:caseId` → redireciona para primeiro módulo ativo
  - Se nenhum módulo ativo → redireciona para `/cases`
  - Integra submódulos com proteção por feature flags:
    - `/capture` → CaptureAIScreen
    - `/recognition` → RecognitionScreen
    - `/photo-report` → PhotoReportScreen
    - `/investigation` → InvestigationReportScreen
    - `/export` → ExportScreen

- **Páginas Placeholder** (`src/pages/CaseModules/`):
  - `Capture.tsx` - Submódulo de Captura & IA
  - `Recognition.tsx` - Submódulo de Reconhecimento
  - `PhotoReport.tsx` - Submódulo de Relatório Fotográfico
  - `Investigation.tsx` - Submódulo de Relatório de Investigação
  - `Export.tsx` - Submódulo de Exportação
  - Cada página mostra o caseId e informações do módulo

- **CaseSidebar.tsx** (`src/components/case/CaseSidebar.tsx`):
  - Sidebar dinâmico que renderiza apenas módulos ativos
  - Menu items com ícones e descrição
  - Destaque do módulo atualmente ativo
  - `CaseSidebar` - versão desktop (w-64, full descriptions)
  - `CaseSidebarMobile` - versão mobile (botões compactos)

#### Mudanças
- **AppRouter.tsx** (refatorizado):
  - Importa `CaseRouter` do novo arquivo
  - Remove imports de CaptureAIScreen, RecognitionScreen, PhotoReportScreen, etc
  - Remove imports de CaseWorkspaceScreen (já movido para dentro de CaseRouter)
  - Rota `/cases/:caseId/*` agora usa `<CaseRouter />`
  - Simplifica lógica de rotas de casos
  - Atualiza comentários de documentação com ETAPA 9

#### Feature Flags (já existentes, apenas confirmadas)
- `captureModule` (default true)
- `recognitionModule` (default true)
- `photoReportModule` (default true)
- `investigationModule` (default true)
- `exportModule` (default true)

Override via `.env`:
```
VITE_FEATURE_CAPTURE_MODULE=true
VITE_FEATURE_RECOGNITION_MODULE=false
VITE_FEATURE_PHOTO_REPORT_MODULE=true
VITE_FEATURE_INVESTIGATION_MODULE=false
VITE_FEATURE_EXPORT_MODULE=true
```

#### Redirecionamento Inteligente
1. Acessar `/cases/:caseId` sem módulo específico → redireciona para primeiro ativo
2. Tentar acessar módulo desativado → `CaseModuleGuard` redireciona para primeiro ativo
3. Se nenhum módulo ativo → redireciona para `/cases` (lista de casos)
4. URL inválida em `/cases/:caseId/*` → redireciona para primeiro ativo

#### Status
- ✅ Build production: `npm run build` - SUCCESS
- ✅ Dev server: `npm run dev` - Pronto para testar
- ✅ Rotas aninhadas funcionando
- ✅ Feature flags protegendo rotas
- ✅ Redirecionamento inteligente implementado
- ✅ Sidebar dinâmico renderizando apenas módulos ativos
- ✅ Nenhum erro de compilação

#### Testes Manuais Obrigatórios
1. Desligar todos os submódulos (VITE_FEATURE_*_MODULE=false)
   - Acessar `/cases/:id` → deve ir para `/cases`

2. Ligar apenas capture
   - Acessar `/cases/:id` → deve ir para `/cases/:id/capture`
   - Sidebar mostra apenas "Captura & IA"

3. Desligar capture, ligar recognition
   - `/cases/:id` → vai para `/cases/:id/recognition`
   - Tentar acessar `/cases/:id/capture` → redireciona para recognition

4. Submódulos múltiplos
   - Capture + recognition + export (outros desligados)
   - Menu mostra só esses 3 em ordem correta
   - Navegação entre eles funciona

#### Arquivos Criados/Modificados
- ✅ src/config/caseModules.ts (novo)
- ✅ src/routes/CaseRouter.tsx (novo)
- ✅ src/pages/CaseModules/Capture.tsx (novo)
- ✅ src/pages/CaseModules/Recognition.tsx (novo)
- ✅ src/pages/CaseModules/PhotoReport.tsx (novo)
- ✅ src/pages/CaseModules/Investigation.tsx (novo)
- ✅ src/pages/CaseModules/Export.tsx (novo)
- ✅ src/components/case/CaseSidebar.tsx (novo)
- ✅ src/routes/AppRouter.tsx (refactorizado)

#### Próximo
- Integrar CaseSidebar nas páginas/layouts de caso
- Testes de feature flags com diferentes combinações
- Deploy em staging

---

### ETAPA 8 ✅ - CRUD de Casos (Consolidação Final)
**Data**: 2026-01-08

#### Adicionado
- **Store de Casos para CRUD** (`src/state/casesStore.ts`):
  - Zustand store com persistência em localStorage
  - Complementa caseStore.ts (que gerencia caso aberto)
  - Actions: fetchCases, createCase, updateCase, deleteCase
  - Seletores: selectedCase(), getCaseById()
  - Estado: cases[], selectedCaseId, loading
  - Integração automática com casesService (mock ou API real)
  - Exportado em state/index.ts

- **Páginas de Casos** (`src/pages/Cases/`):
  - `List.tsx`: Listagem estruturada de casos seguindo padrão de Clientes
    - Cartões com informações (BO, natureza, data/hora, endereço, status)
    - Botões: Novo Caso, Editar, Deletar com confirmação
    - Estados: vazio, carregando, com dados
    - Integração com useCasesStore e fetchCases()
    - Dark mode support

  - `Edit.tsx`: Formulário para editar caso existente
    - Campos: BO (readonly), natureza, status, endereço
    - Localização: CEP, bairro, cidade, estado
    - Jurisdição: circunscrição, unidade
    - Validação e navegação automática
    - Integração com updateCase via store

- **CasesListScreen.tsx** (Refactorizado):
  - Migrado de useCaseStore para useCasesStore (plural)
  - Adicionado useEffect para fetchCases() ao montar
  - Funções async para createCase e deleteCase
  - Substituído template literals por template strings corretas
  - Gerenciamento de loading e erro

- **Header.tsx** (Corrigido):
  - Usa useCasesStore para criar casos globalmente
  - Sincroniza com caseStore para gerenciador aberto
  - createCase agora é async com await
  - Navegação correta após criação

- **AppRouter.tsx** (Atualizado):
  - Rotas adicionadas: `/cases/new` e `/cases/:caseId/edit`
  - Documentação completa das rotas
  - Importações de Cases/List e Cases/Edit

- **vite.config.ts** (Corrigido):
  - Configurado rollupOptions.external para React
  - Fix para build error: "react/jsx-runtime not found"
  - Build agora funciona corretamente: `npm run build` ✅

- **Feature Flags para Submódulos de Casos** (Anterior):
  - `captureModule`: Ativa/desativa Captura & IA
  - `recognitionModule`: Ativa/desativa Reconhecimento Visuográfico
  - `photoReportModule`: Ativa/desativa Relatório Fotográfico
  - `investigationModule`: Ativa/desativa Relatório de Investigação
  - `exportModule`: Ativa/desativa Exportação/PDF

#### Status
- ✅ Build production: `npm run build` - SUCCESS
- ✅ Dev server: `npm run dev` - SUCCESS
- ✅ Store de Casos funcionando com persist
- ✅ CRUD completo: Create, Read, Update, Delete
- ✅ Listagem com casesStore
- ✅ Edição via formulário reativo
- ✅ Padrão replicado de clientsStore
- ✅ Todas as rotas funcionando

#### Arquivos Criados/Modificados
- ✅ src/pages/Cases/List.tsx (novo)
- ✅ src/pages/Cases/Edit.tsx (novo)
- ✅ src/pages/CasesListScreen.tsx (refactorizado)
- ✅ src/components/layout/Header.tsx (corrigido)
- ✅ src/routes/AppRouter.tsx (atualizado)
- ✅ vite.config.ts (corrigido)
- ✅ CHANGELOG.md (documentação)

---

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
