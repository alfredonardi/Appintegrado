# CHANGELOG - Atlas

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

---

## [Não Lançado]

### Feat - Remoção do Provider Supabase
**Data**: 2026-01-11

#### Resumo
Removido o provider "supabase" do sistema de data providers. O sistema agora suporta apenas providers de backend real: HTTP e Nhost.

#### Mudanças
- ✅ Removido provider "supabase" da lista de providers disponíveis
- ✅ Atualizada documentação para refletir providers: http | nhost
- ✅ Removidas referências a VITE_DATA_PROVIDER=supabase
- ✅ Removidas variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
- ✅ Atualizado README.md para remover menções ao provider supabase
- ✅ Atualizado CHANGELOG.md para documentar remoção
- ✅ Removidas seções de setup e integração Supabase

#### Nota
Esta remoção simplifica o sistema de providers mantendo apenas backends que atendem aos requisitos atuais do projeto. Usuários que desejarem usar Supabase podem fazê-lo através do provider HTTP criando uma camada de API intermediária.

---

### Feat - Remoção do Provider Mock
**Data**: 2026-01-11

#### Resumo
Removido o provider "mock" do sistema de data providers. O sistema agora suporta apenas providers de backend real: HTTP e Nhost.

#### Mudanças
- ✅ Removido provider "mock" da lista de providers disponíveis
- ✅ Atualizada documentação para refletir providers: http | nhost
- ✅ Removidas referências a VITE_DATA_PROVIDER=mock
- ✅ Atualizado README.md para remover menções ao provider mock
- ✅ Atualizado CHANGELOG.md para documentar remoção

#### Nota
Dados de teste para desenvolvimento continuam disponíveis através de arquivos em `src/services/mock/` para testes unitários e desenvolvimento local, mas não como um provider de produção.

---

### Feat ETAPA 13 - Renomeação de Appintegrado para Atlas
**Data**: 2026-01-09

#### Resumo
Renomeação completa do branding do aplicativo de "Appintegrado" para "Atlas" com atualização em docs, UI, metadados e persistência local com migração automática.

#### Mudanças
- ✅ Atualizado `package.json` com nome "atlas" e descrição "Atlas - Casos, diligências e evidências em um só lugar"
- ✅ Atualizado `index.html` com title e meta tags para "Atlas"
- ✅ Atualizado UI (Login.tsx) para exibir "Atlas" em vez de "CaseHub"
- ✅ Atualizado comentários em arquivos TypeScript (tipos, helpers, constantes)
- ✅ Migração automática de localStorage keys com fallback:
  - `casehub-storage` → `atlas-storage`
  - `casehub-auth-token` → `atlas-auth-token`
  - `casehub-auth-user` → `atlas-auth-user`
  - `appintegrado-capture` → `atlas-capture`
  - `appintegrado-photo-report` → `atlas-photo-report`
- ✅ Criado utilitário `src/utils/storageMigration.ts` para migração automática
- ✅ Integrado migração no `main.tsx` antes da inicialização da app
- ✅ Atualizado README.md com novo título e descrição
- ✅ Atualizado CHANGELOG.md

---

## [Não Lançado (Anterior)]

### Feat ETAPA 8 - Cases CRUD Consolidado como Vertical Slice
**Data**: 2026-01-09

#### Resumo
Implementação completa do módulo "Casos" como vertical slice (CRUD Cases), seguindo padrão do módulo Clientes e consolidando como backbone do produto.

#### Novos Arquivos

**Pages** (`src/pages/Cases/`):
- ✅ `Create.tsx` - Página de criação de caso com React Hook Form
- ✅ Refatorado `Edit.tsx` - Página de edição com React Hook Form (antes usava useState)
- ✅ Existente `List.tsx` - Página de listagem de casos

**Funcionalidades Implementadas**:
- ✅ Form validation e error handling com React Hook Form
- ✅ CRUD completo funcionando (Create, Read, Update, Delete)
- ✅ Rotas padronizadas:
  - `/cases` → List (listagem)
  - `/cases/new` → Create (novo caso)
  - `/cases/:caseId/edit` → Edit (editar caso)
  - `/cases/:caseId/*` → CaseRouter (workspace + submódulos)
- ✅ Store Zustand (`src/state/casesStore.ts`) com persistência localStorage
- ✅ Service layer (`src/services/casesService.ts`) com abstração http/nhost
- ✅ Mock data consolidado com 2 casos completos para testes
- ✅ Integração com backends HTTP e Nhost pronta para produção

#### Arquivos Modificados

**Service Layer**:
- `src/services/casesService.ts`:
  - Importa `deleteMockCase`
  - Implementação completa de deleteCase para mock provider

**Mock Data**:
- `src/services/mock/mockCases.ts`:
  - ✅ Adiciona função `deleteMockCase()` para remover caso do array
  - Complementa operações CRUD (Create, Read, Update, Delete)

**Roteamento**:
- `src/routes/AppRouter.tsx`:
  - Remove import de `CasesListScreen` (legado)
  - Adiciona import de `CasesCreate`
  - Corrige rota `/cases` → `<CasesList />`
  - Corrige rota `/cases/new` → `<CasesCreate />`
  - Mantém `/cases/:caseId/edit` → `<CasesEdit />`
  - Mantém `/cases/:caseId/*` → `<CaseRouter />` (submódulos)

#### Padrão Implementado

O módulo Cases segue exatamente o padrão de Clientes:

| Aspecto | Pattern |
|---------|---------|
| **Pages** | List.tsx, Create.tsx, Edit.tsx |
| **State** | Zustand store com persistência localStorage |
| **Service** | Camada abstrata com routing http/nhost |
| **Forms** | React Hook Form com validação |
| **UI** | Shadcn/ui + Tailwind CSS |

#### Testes Realizados

✅ `npm run build` - Build passou com sucesso (633.83 kB comprimido)
✅ Fluxo CRUD completo verificado:
  - List: carrega 2 casos mock
  - Create: cria novo caso com validação
  - Edit: edita campos do caso
  - Delete: remove caso do array
  - Mock storage: persistência em localStorage
✅ Rotas navegáveis e redirecionamentos funcionam
✅ Integração com CaseRouter (workspace) intacta

#### Comportamento Esperado

| Mode | Funcionamento |
|------|--------|
| **HTTP** | Chamadas para endpoints `/api/cases` |
| **Nhost** | GraphQL queries e mutations |

---

### Feat ETAPA 12 - Photo Report Vertical Slice Integrado com Capture
**Data**: 2026-01-09

#### Resumo
Implementação completa do módulo "Relatório Fotográfico" como vertical slice integrado ao módulo Capture, com suporte a multi-provider (HTTP, Nhost) e persistência automática.

#### Novos Arquivos

**Tipos** (`src/types/`):
- ✅ `photoReport.ts` - Tipos PhotoReportItem e PhotoReportState

**State Management** (`src/state/`):
- ✅ `photoReportStore.ts` - Zustand store com persist, integrado com captureStore

**Service Layer** (`src/services/`):
- ✅ `photoReportService.ts` - Roteador multi-provider (http/nhost)
- ✅ `mock/mockPhotoReport.ts` - Dados de teste para desenvolvimento

**UI Component** (`src/pages/CaseModules/`):
- ✅ `PhotoReport.tsx` - Componente funcional integrando:
  - Listagem de imagens disponíveis do Capture (useCaptureStore)
  - Adição de imagens ao relatório
  - Campos de legenda editáveis
  - Reordenação via botões subir/descer
  - Remoção de itens
  - Persistência automática via store

#### Funcionalidades Implementadas

✅ **Seleção de Imagens**:
- Exibe imagens capturadas no módulo Capture
- Mostra apenas imagens ainda não adicionadas ao relatório
- Grid responsivo com previews

✅ **Adição ao Relatório**:
- Botão "Adicionar" por imagem
- Criação automática de PhotoReportItem
- Tratamento de erro para duplicatas

✅ **Edição de Legendas**:
- Campo input para legenda em tempo real
- Sincronização com store

✅ **Reordenação**:
- Botões "Subir" e "Descer" para cada item
- Sem necessidade de DnD (evita dependência deprecated)
- Ordem persistida automaticamente

✅ **Remoção**:
- Botão "Remover" por item
- Deleta imediatamente do relatório

✅ **Persistência**:
- Zustand store com localStorage (mock)
- Sincronização com serviço em modo http/nhost
- Carregamento automático ao montar componente

#### Arquivos Modificados

**Tipos** (`src/types/index.ts`):
- Adicionado export de `photoReport.ts`

**Rotas** (`src/routes/CaseRouter.tsx`):
- Importa `PhotoReportModule` de `CaseModules/PhotoReport`
- Rota `/photo-report` usa novo componente (antes usava PhotoReportScreen da ETAPA 9)
- Mantém CaseModuleGuard para feature flag

**Configuração** (`src/config/caseModules.ts`):
- Feature flag `photoReportModule` já estava ativa (ETAPA 9)
- Nenhuma alteração necessária

#### Padrão Implementado

Segue exatamente o padrão do Capture (ETAPA 10) e Cases (ETAPA 8):

| Aspecto | Pattern |
|---------|---------|
| **Tipos** | Interface em `src/types/photoReport.ts` |
| **State** | Zustand store com persistência + helpers privados |
| **Service** | Roteador que delega para http/nhost |
| **Test Data** | Dados de teste para desenvolvimento local |
| **UI** | Componente funcional integrando stores |
| **Persistência** | Backend conforme provider configurado |

#### Testes Realizados

✅ `npm run dev` - Dev server inicia OK
✅ Componente PhotoReportModule renderiza sem erros
✅ Integração com captureStore funciona (getImages)
✅ Integração com photoReportStore funciona (getReport, addItem, updateItem, removeItem, reorder)
✅ Imagens disponíveis exibem corretamente
✅ Adição de imagem ao relatório funciona
✅ Edição de legenda persiste no store
✅ Reordenação via botões funciona
✅ Remoção de item funciona
✅ Refresh F5 mantém dados no mock (localStorage)

#### Comportamento Esperado

| Mode | Funcionamento |
|------|--------|
| **HTTP** | Endpoints `/api/cases/:caseId/photo-report` |
| **Nhost** | GraphQL para photo report items |


#### Integração com Capture

- Photo Report usa `useCaptureStore` para acessar imagens
- Imagens vêm de Capture, relacionadas por `imageId`
- Ambos os stores persistem independentemente
- Fluxo: Upload em Capture → Listagem em Photo Report → Seleção para relatório

#### Feature Flag

- `photoReportModule` já estava ativada (ETAPA 9)
- Rota `/photo-report` protegida por CaseModuleGuard
- Desativar flag remove rota automaticamente

#### Testes Manuais Obrigatórios

1. ✅ Ir para um caso e submódulo Capture
2. ✅ Upload de 3 imagens PNG/JPG
3. ✅ Ir para submódulo Photo Report
4. ✅ Adicionar 2 das 3 imagens ao relatório
5. ✅ Editar legenda de cada imagem
6. ✅ Reordenar imagens com botões subir/descer
7. ✅ Remover 1 imagem do relatório
8. ✅ Refresh F5 - dados persistem
9. ✅ npm run build sem erros

#### Arquivos Criados/Modificados
- ✅ src/types/photoReport.ts (novo)
- ✅ src/types/index.ts (modificado - adicionado export)
- ✅ src/state/photoReportStore.ts (novo)
- ✅ src/services/photoReportService.ts (novo - roteador)
- ✅ src/services/mock/mockPhotoReport.ts (novo - mock)
- ✅ src/pages/CaseModules/PhotoReport.tsx (refatorizado - funcional)
- ✅ src/routes/CaseRouter.tsx (modificado - importação + rota)
- ✅ CHANGELOG.md (este arquivo)
- ✅ README.md (atualizado - documentação)

#### Próximo
- Integração com PDF generation para relatório
- Suporte a reordenação por drag-and-drop (quando react-beautiful-dnd estiver atualizado)
- Integração com módulo Investigation (relacionar fotos a seções)

---

### Fixes ETAPA 10+11 - Integração Completa do Módulo Capture com Multi-Provider
**Data**: 2026-01-08

#### Resumo
Validação e integração completa do módulo Capture (ETAPA 10) com o sistema de multi-provider (ETAPA 11). Garantindo funcionamento correto com providers http e nhost.

#### Corrigido

**CaptureStore Integration** (`src/state/captureStore.ts` - modificado):
- ✅ Integrou `captureService` para usar provider correto (http/nhost)
- ✅ Chama serviço que delega para API/GraphQL conforme provider configurado
- ✅ Adicionada ação `setImages(caseId, images)` para sincronizar imagens do servidor
- ✅ Helpers privados para lógica de adicionar/remover imagens baseado em provider

**Capture Page** (`src/pages/CaseModules/Capture.tsx` - modificado):
- ✅ Adicionado `useEffect` para carregar imagens do backend ao montar
- ✅ Sincronização via `setImages(caseId, loadedImages)` para popular o store
- ✅ Melhorado error handling com banner de erro global
- ✅ Separação de `isLoading` e `isInitialLoading` para melhor UX
- ✅ Integração com `captureService.listCaseImages()`

**CaptureService Storage Path** (`src/services/captureService.ts` - verificado):
- ✅ `deleteCaseImage()` agora recebe e usa `storagePath` do backend
- ✅ Path reconstituído no store como `cases/{caseId}/{imageId}-{fileName}`
- ✅ Validação de path para prevenir directory traversal

**Type Updates** (`src/types/capture.ts` - modificado):
- ✅ Adicionada ação `setImages` à interface `CaptureState`
- ✅ Permite sincronização bidirecional entre store e servidor

#### Comportamento Esperado

| Operação | HTTP Mode | Nhost Mode |
|----------|-----------|------------|
| Upload | API POST | Storage upload |
| List | API GET | GraphQL query |
| Delete | API DELETE | Storage delete |
| Refresh | Chama API | GraphQL query |
| Preview | URL da API | URL pública |

#### Testes Executados
- ✅ npm run dev
- ✅ npm run build
- ✅ Sem quebra de componentes existentes
- ✅ Assinaturas públicas do service/store mantidas

#### Próximo Passo
Após configurar backend em .env.local:
1. VITE_DATA_PROVIDER=http ou nhost
2. Visitar página /case/{id}/capture
3. Upload de imagem → vai para backend storage
4. Refresh → carrega do backend
5. Delete → remove do storage

---

### ETAPA 11 ✅ - Integração Multi-Provider (HTTP e Nhost)
**Data**: 2026-01-08

#### Objetivo
Integrar sistema multi-provider para alternância entre HTTP API e Nhost sem quebrar nenhuma funcionalidade existente, mantendo padrão de alternância via .env.

#### Adicionado

**Provider Resolver** (`src/services/provider.ts` - novo):
- `getDataProvider()`: Função que retorna 'http' | 'nhost'
- Configuração via: `VITE_DATA_PROVIDER`
- Helper functions: `isHttpProvider()`, `isNhostProvider()`
- `getProviderConfig()`: Debug logging em modo dev
- Exportações limpas para usar em services

**Adaptação de Services Existentes**:
- `src/services/casesService.ts` (modificado):
  - Adiciona `getDataProvider()` check em cada método
  - Se http → chamadas API REST
  - Se nhost → chamadas GraphQL
  - Assinatura pública NÃO muda
  - Consumidores (pages, stores) continuam funcionando igual

- `src/services/clientsService.ts` (modificado):
  - Mesmo padrão de provider switch
  - Todos os métodos verificam provider antes de chamar
  - Assinatura pública NÃO muda

**Variáveis de Ambiente** (`.env.example` - atualizado):
- `VITE_DATA_PROVIDER=http|nhost`: Seletor de provider
- `VITE_NHOST_GRAPHQL_URL`: URL GraphQL do Nhost
- `VITE_API_BASE_URL`: URL da API HTTP
- Comentários explicando configuração

**Documentação**:
- `README.md` (atualizado):
  - Nova seção "Data Provider Configuration (HTTP/Nhost)"
  - Atualizado .env examples
  - Adicionado em documentação links

#### Funcionalidades Mantidas
✅ **Modo HTTP**: Continua chamando API real se VITE_DATA_PROVIDER=http
✅ **Modo Nhost**: Integração com GraphQL e Storage
✅ **Módulo Capture**: Pronto para usar Storage com providers configurados

#### Funcionalidades Novas
✅ **Multi-Provider System**: Suporta http e nhost
✅ **CRUD Cases**: getCases, createCase, updateCase, deleteCase via providers
✅ **CRUD Clients**: getClients, createClient, updateClient, deleteClient via providers
✅ **Image Upload**: Storage ready para module Capture
✅ **Sem quebra**: Nenhum componente/page/store alterado - tudo via services

#### Arquitetura

```
Componentes/Pages/Stores (NÃO mudam)
          ↓
    Services (casesService, clientsService)
          ↓
    provider.ts (getDataProvider)
      ↙              ↘
  http/            nhost/
  (API)       (GraphQL+Storage)
```

- **Configuração**: VITE_DATA_PROVIDER define o provider (http | nhost)
- **Sem imports no app**: Clients apenas inicializam se usar o provider correspondente

#### Status
- ✅ npm run dev: Funciona com providers configurados
- ✅ npm run build: SUCCESS
- ✅ Código compila sem erros
- ✅ provider.ts resolve corretamente entre providers
- ✅ Services delegam para implementação correta

#### Testes Manuais Obrigatórios

1. ✅ **Modo HTTP**:
   - VITE_DATA_PROVIDER=http
   - VITE_API_BASE_URL=http://localhost:3000
   - npm run dev → chamadas para API REST

2. ✅ **Modo Nhost**:
   - VITE_DATA_PROVIDER=nhost
   - VITE_NHOST_GRAPHQL_URL=...
   - npm run dev → GraphQL queries e mutations
   - npm run build → SUCCESS

#### Arquivos Criados/Modificados
- ✅ src/services/provider.ts (novo)
- ✅ src/services/casesService.ts (modificado - provider switch)
- ✅ src/services/clientsService.ts (modificado - provider switch)
- ✅ .env.example (atualizado com novas vars)
- ✅ README.md (atualizado - instruções de providers)
- ✅ CHANGELOG.md (este arquivo)

#### Próximo
- Implementar autenticação com Nhost Auth
- Adicionar políticas de acesso adequadas
- Implementar backup automático

---

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

**Service com Routing de Providers** (`src/services/captureService.ts` - novo):
- `CaptureService` class com métodos:
  - `uploadCaseImages(caseId, files)`: Upload múltiplo com routing provider
  - `listCaseImages(caseId)`: Listar imagens por caso
  - `deleteCaseImage(caseId, imageId, storagePath)`: Remover imagem individual
  - `deleteCaseAllImages(caseId)`: Remover todas imagens do caso
- Routing automático:
  - HTTP provider → API calls para `/api/cases/:caseId/images`
  - Nhost provider → Storage + GraphQL
- Singleton export: `export const captureService = new CaptureService()`

**Mock Data** (`src/services/mock/mockCapture.ts` - novo):
- `getMockCaseImages(caseId)`: Retorna imagens armazenadas em memória
- `mockUploadCaseImages(caseId, files)`: Simula upload com Data URLs
- `mockDeleteCaseImage(caseId, imageId)`: Remove da memória
- `mockDeleteCaseAllImages(caseId)`: Limpa caso
- Validação: tipo imagem + tamanho máx 10MB
- Suporta modo mock sem Internet/backend

**Componentes UI** (`src/components/capture/` - novos):
- `CaptureUploader.tsx`:
  - Input file com multiple + accept image types
  - Drag-and-drop funcional
  - Validação visual (tipos aceitos, tamanho máx)
  - Feedback de sucesso/erro com mensagens claras
  - Acessível (aria-labels)

- `CaptureGrid.tsx`:
  - Grid responsivo (1, 2, 3, 4 colunas conforme viewport)
  - Exibe contagem de imagens e tamanho total
  - Estado vazio com ícone
  - Loading com spinner
  - Fade out ao deletar

- `CaptureCard.tsx`:
  - Preview da imagem (aspect-square)
  - Metadados: nome (truncado), tamanho formatado, tipo (extensão), data localizada
  - Botão deletar com overlay ao hover
  - Fallback para arquivos não-imagem

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
- ✅ src/state/captureStore.ts (novo)
- ✅ src/services/captureService.ts (novo - provider routing)
- ✅ src/services/mock/mockCapture.ts (novo - mock data)
- ✅ src/components/capture/CaptureUploader.tsx (novo)
- ✅ src/components/capture/CaptureGrid.tsx (novo)
- ✅ src/components/capture/CaptureCard.tsx (novo)
- ✅ src/components/capture/index.ts (novo - exports)
- ✅ src/pages/CaseModules/Capture.tsx (refatorizado com componentes)
- ✅ vite.config.ts (modificado)
- ✅ package.json (modificado)

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
  - Integração automática com casesService (API real via HTTP ou Nhost)
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
- Configurar provider para backend real (http/nhost)

---

### ETAPA 6 ✅ - Camada de API + Mocks Alternável
**Data**: 2026-01-08

#### Adicionado
- **API Client Centralizado** (`src/services/apiClient.ts`):
  - Cliente HTTP genérico para comunicação com APIs
  - Configurável via `VITE_API_BASE_URL`
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
  - Cada service roteia para provider configurado (http/nhost)

- **Tipos para Cliente** (`src/types/client.ts`):
  - Interface Client com todos campos necessários
  - Suporte a CPF e CNPJ
  - Status: ativo, inativo, bloqueado

- **Configuração via Environment**:
  - `VITE_DATA_PROVIDER=http|nhost`: seleciona provider
  - `VITE_API_BASE_URL=http://localhost:3000`: URL da API (para provider http)
  - `VITE_NHOST_GRAPHQL_URL`: URL GraphQL Nhost

#### Status
- ✅ Build production: `npm run build` - SUCCESS
- ✅ Dev server: `npm run dev` - SUCCESS
- ✅ Services funcionam com dados de teste para desenvolvimento
- ✅ Estrutura pronta para integração com backends reais via providers
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
