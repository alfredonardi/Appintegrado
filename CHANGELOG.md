# CHANGELOG - Appintegrado

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

---

## [Não Lançado]

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
