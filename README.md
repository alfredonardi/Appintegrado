# Appintegrado - App Escalável para Investigação Forense

Bundle exportado do Figma transformado em uma aplicação React/Vite escalável, com estrutura profissional, feature flags, autenticação mock e API abstrata.

## 📋 Status de Transformação

- ✅ **ETAPA 1**: Diagnóstico inicial e plano
- ✅ **ETAPA 2**: Estrutura app-ready (pages, components, services)
- ✅ **ETAPA 3**: React Router + Layout base
- ✅ **ETAPA 4**: Auth mock + proteção de rotas
- ✅ **ETAPA 5**: Feature flags
- ✅ **ETAPA 6**: Camada de API + mocks alternável
- ✅ **ETAPA 7**: Primeiro CRUD (Clientes)

Veja `docs/roadmap.md` para detalhes de cada etapa.

---

## 🚀 Quick Start

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abre em `http://localhost:5173/`

### Build Produção

```bash
npm run build
```

---

## 📁 Estrutura do Projeto

```
src/
├── pages/                      # Telas/páginas da aplicação
│   ├── CasesListScreen.tsx     # Lista de casos
│   ├── CaseWorkspaceScreen.tsx # Workspace do caso
│   ├── CaptureAIScreen.tsx     # Captura com IA
│   ├── RecognitionScreen.tsx   # Reconhecimento de fotos
│   ├── PhotoReportScreen.tsx   # Relatório fotográfico
│   ├── InvestigationReportScreen.tsx  # Relatório de investigação
│   └── ExportScreen.tsx        # Exportação/PDF
│
├── components/                 # Componentes reutilizáveis
│   ├── layout/
│   │   ├── Sidebar.tsx         # Menu lateral
│   │   ├── Topbar.tsx          # Barra superior
│   │   └── Toast.tsx           # Notificações
│   └── ui/                     # ~50 componentes primitivos
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ... (Radix UI + custom)
│
├── state/                      # Estado global (Zustand)
│   ├── caseStore.ts           # Store de casos
│   └── index.ts               # Exports
│
├── services/                   # Serviços e API
│   ├── pdfService.ts          # Geração de PDFs
│   ├── exportService.ts       # Exportação
│   └── mock/                  # (Futura) Dados fake
│
├── types/                      # Tipos TypeScript
│   ├── case.ts                # Modelo de dados principal
│   ├── fieldRegistry.ts       # Registry de campos canônicos
│   └── index.ts
│
├── utils/                      # Utilitários
│   ├── figma/                 # Utilitários do Figma
│   └── ...
│
├── config/                     # (Futura) Configurações globais
├── hooks/                      # (Futura) Custom hooks
├── constants/                  # Constantes da aplicação
├── assets/                     # Imagens, ícones
├── styles/                     # CSS global
│
├── App.tsx                     # Componente raiz
└── main.tsx                    # Entry point
```

---

## 🏗️ Stack Técnico

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **React** | 18.3.1 | Framework UI |
| **Vite** | 6.3.5 | Bundler & Dev Server |
| **TypeScript** | - | Tipagem estática |
| **Zustand** | 5.0.9 | State management |
| **Tailwind CSS** | 4.1.12 | Styling |
| **Radix UI** | Latest | Componentes sem estilo |
| **Material-UI** | 7.3.5 | Componentes estilizados |
| **React Hook Form** | 7.55.0 | Formulários |
| **Recharts** | 2.15.2 | Gráficos |

---

## 📖 Documentação

### Diagnóstico e Roadmap
- **[docs/diagnostico.md](docs/diagnostico.md)** - Análise da estrutura atual e problemas identificados
- **[docs/roadmap.md](docs/roadmap.md)** - Sequência de trabalho por ETAPA
- **[CHANGELOG.md](CHANGELOG.md)** - Histórico de mudanças

### Integração Supabase
- **[docs/supabase-setup.md](docs/supabase-setup.md)** - Guia completo de setup Supabase (PostgreSQL + Storage)

### Guias Originais (Figma)
- **[PROJETO.md](PROJETO.md)** - Escopo e visão geral
- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Design system e componentes
- **[GUIA_RAPIDO.md](GUIA_RAPIDO.md)** - Guia rápido de uso

---

## 🔄 Features Implementados

### ✅ Atuais
- **Zustand Store** com persistência em localStorage
- **7 Telas complexas** funcionando (Cases, Workspace, Capture, Recognition, Photo Report, Investigation, Export)
- **~50 Componentes UI** reutilizáveis
- **TypeScript** com tipos bem definidos
- **Tailwind CSS** para estilização
- **Modelo de dados robusto** com auditoria integrada
- **React Router v6** com URL-based routing e nested routes
- **Autenticação Mock** com session persistence em localStorage
- **Proteção de Rotas** com PrivateRoute guard
- **Feature Flags** para ativar/desativar módulos via config ou .env
- **useFeature Hook** para verificar flags em componentes
- **FeatureGuard Component** para condicionar rendering por flag
- **API Client** centralizado com suporte a mock/real (ETAPA 6)
- **Services abstratos** para Casos, Clientes, Autenticação (ETAPA 6)
- **Mock Data** com 2 casos, 3 clientes, 5 usuários (ETAPA 6)
- **Módulo CRUD Completo de Clientes** (ETAPA 7):
  - Listagem com filtros por status
  - Criação de novo cliente
  - Edição de cliente existente
  - Deletação com confirmação
  - Store Zustand com persistência
  - Integrado com services layer

### 🔲 Próximas Implementações
- Implementar outros módulos (Relatórios, Analytics, etc)
- Integrar com API real (trocar `VITE_USE_MOCK_API=false`)

---

## 📝 Modelo de Dados Principal

### Case (Caso de Investigação)

```typescript
interface Case {
  id: string;                    // UUID
  bo: string;                    // Boletim de Ocorrência
  natureza: string;              // Ex: Homicídio, Roubo
  status: CaseStatus;            // rascunho | em_revisao | finalizado
  dataHoraFato: string;          // ISO date
  endereco: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
  circunscricao: string;
  unidade: string;

  // Campos canônicos
  fieldValues: FieldValue[];     // Array de valores estruturados

  // Fotos de evidência
  photos: PhotoEvidence[];

  // Extrações IA
  aiExtractions: AIExtraction[];

  // Equipe
  team: TeamMember[];

  // Timeline de eventos
  events: TimelineEvent[];

  // Relatórios
  photoReport: PhotoReport;
  investigationReport: InvestigationReport;
  generatedPDFs: GeneratedPDF[];

  // Auditoria
  auditLog: AuditEvent[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

---

## 🛠️ Como Usar (Desenvolvimento)

### Iniciar Dev Server

```bash
npm run dev
```

### Compilar TypeScript e Testar

```bash
npm run build
```

### Explorar Store (Zustand)

```typescript
import { useCaseStore } from './state';

// Em componente
const cases = useCaseStore((state) => state.cases);
const selectedCase = useCaseStore((state) => state.selectedCase());
const { createCase, updateCase } = useCaseStore();
```

### Adicionar Novo Componente UI

1. Criar em `src/components/ui/novo-componente.tsx`
2. Exportar em `src/components/ui/` (se houver index)
3. Usar como:
```typescript
import { NovoComponente } from '@/components/ui/novo-componente';
```

---

## ⚙️ Configuração

### Camada de API (ETAPA 6) ✅ Implementado

**Client HTTP centralizado** (`src/services/apiClient.ts`):

```typescript
import { apiClient } from '@/services/apiClient';

// Verificar modo
if (apiClient.isMockMode()) {
  console.log('Usando dados fake');
}

// Config atual
const config = apiClient.getConfig();
```

**Services abstratos** (`src/services/`):

```typescript
// Cases
import { casesService } from '@/services/casesService';

const cases = await casesService.getCases();
const caseById = await casesService.getCaseById('case-001');
await casesService.createCase('BO-2024-003');

// Clientes
import { clientsService } from '@/services/clientsService';

const clients = await clientsService.getClients();
const client = await clientsService.getClientById('client-001');
await clientsService.createClient({ name: 'João', email: 'joao@example.com', ... });
await clientsService.deleteClient('client-001');

// Autenticação
import { authService } from '@/services/authService';

const { token, user } = await authService.login('user@example.com', 'password');
await authService.logout();
await authService.register({ name, email, password, role });
```

**Alternador Mock/Real** via `.env`:

```env
# Modo desenvolvimento (usa dados fake)
VITE_USE_MOCK_API=true

# Modo produção (chama API real)
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://api.appintegrado.com
```

### Feature Flags (ETAPA 5) ✅ Implementado

Arquivo `src/config/features.ts` já criado com feature flags:

```typescript
export const FEATURE_FLAGS = {
  auth: true,
  dashboard: true,
  casesModule: true,
  clientsModule: false,     // Desativar para ETAPA 7
  reportsModule: false,
  settingsModule: true,
  analyticsModule: false,
};
```

**Como usar em componentes:**

```typescript
// Hook
import { useFeature } from '@/hooks/useFeature';

function Dashboard() {
  const isClientsEnabled = useFeature('clientsModule');
  if (!isClientsEnabled) return null;
  return <Clients />;
}

// Component wrapper
import { FeatureGuard } from '@/components/FeatureGuard';

function App() {
  return (
    <FeatureGuard feature="clientsModule">
      <Clients />
    </FeatureGuard>
  );
}

// Em rotas
import { FEATURE_FLAGS } from '@/config/features';

{FEATURE_FLAGS.clientsModule && (
  <Route path="/clients" element={<Clients />} />
)}
```

### Data Provider Configuration (Mock/HTTP/Supabase)

Você pode escolher entre três provedores de dados:

```env
# Modo 1: Mock Data (desenvolvimento local, padrão)
VITE_DATA_PROVIDER=mock

# Modo 2: HTTP API (API real)
VITE_DATA_PROVIDER=http
VITE_API_BASE_URL=http://localhost:3000

# Modo 3: Supabase (PostgreSQL + Storage)
VITE_DATA_PROVIDER=supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Nota**: A prioridade é `VITE_DATA_PROVIDER`. Se não definido, usa `VITE_USE_MOCK_API` para compatibilidade regressiva.

### Integração com Supabase

Para usar Supabase como data provider:

1. **Instale a dependência**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Configure em `.env.local`**:
   ```env
   VITE_DATA_PROVIDER=supabase
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=seu-anon-key-aqui
   ```

3. **Siga o setup completo**: Veja `docs/supabase-setup.md` para:
   - Criar projeto Supabase
   - Configurar banco de dados (tabelas cases e clients)
   - Configurar storage para imagens
   - Testar a integração

**Funcionalidades Supabase**:
- ✅ CRUD completo de casos (getCases, createCase, updateCase, deleteCase)
- ✅ CRUD completo de clientes (getClients, createClient, updateClient, deleteClient)
- ✅ Upload de imagens para Storage (módulo Capture)
- ✅ Filtragem nativa por status
- ✅ Busca por email e documento

### Variáveis de Ambiente

Criar `.env` para override de flags (ver `.env.example`):

```
# Feature Flags
VITE_FEATURE_AUTH=true
VITE_FEATURE_CASESMODULE=true
VITE_FEATURE_CLIENTSMODULE=false
VITE_FEATURE_REPORTSMODULE=false
VITE_FEATURE_SETTINGSMODULE=true
VITE_FEATURE_ANALYTICSMODULE=false

# Data Provider
VITE_DATA_PROVIDER=mock
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3000

# Supabase (opcional)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Nota**: Variáveis com prefix `VITE_FEATURE_` fazem override dos defaults em `src/config/features.ts`.

---

## 🔐 Autenticação (ETAPA 4) ✅ Implementado

- **Mock Login**: qualquer email/senha não-vazia aceita (arquivo `src/pages/Login.tsx`)
- **Proteção de Rotas**: PrivateRoute wrapper (`src/components/routes/PrivateRoute.tsx`)
- **Session Persistence**: token + user salvo em localStorage
- **Logout**: limpa session e redireciona para login
- **AuthContext**: gerencia autenticação global (`src/state/auth/AuthContext.tsx`)

**Como usar:**

```typescript
// Em componentes
import { useAuth } from '@/state/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Olá, {user?.name}</p>}
      <button onClick={() => logout()}>Sair</button>
    </div>
  );
}

// Em rotas (AppRouter.tsx)
<Route element={<PrivateRoute />}>
  <Route element={<AppLayout />}>
    {/* Rotas protegidas aqui */}
  </Route>
</Route>
```

**Credenciais de teste:**
- Email: qualquer (ex: teste@example.com)
- Senha: qualquer (não vazia)

---

## 📦 Dependências Principais

```json
{
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "typescript": "latest",
  "vite": "6.3.5",
  "zustand": "5.0.9",
  "tailwindcss": "4.1.12",
  "@radix-ui/*": "latest",
  "@mui/material": "7.3.5",
  "react-hook-form": "7.55.0",
  "recharts": "2.15.2"
}
```

Veja `package.json` para lista completa.

---

## 🐛 Problemas Conhecidos

1. **React Beautiful DnD deprecated** - npm warning (não quebra)
   - Refatorar para react-dnd em release futura

2. **Bundle size > 500KB** - Vite warning (previsível)
   - Implementar code-splitting em ETAPA 3+

3. **Sem testes automatizados** - Implementar em fase 2

---

## 📚 Próximos Passos

### Desenvolvimento Futuro

1. **Implementar Módulos Adicionais**
   - Relatórios (reportsModule)
   - Analytics (analyticsModule)
   - Seguir mesmo padrão da ETAPA 7 (Pages, Store, Services)

2. **Integrar com API Real**
   - Criar arquivo `.env` com `VITE_USE_MOCK_API=false`
   - Implementar endpoints da API backend
   - Substituir mock data por chamadas HTTP reais

3. **Melhorias de UX/Design**
   - Adicionar paginação nas listas
   - Implementar busca e filtros avançados
   - Validação de CPF/CNPJ
   - Loading states mais elaborados

4. **Testing**
   - Testes unitários dos stores
   - Testes de componentes
   - Testes de integração

### Padrão de Desenvolvimento

Cada novo módulo/CRUD deve seguir o padrão estabelecido:
1. Criar tipos em `src/types/`
2. Criar mock data em `src/services/mock/`
3. Criar service em `src/services/`
4. Criar store em `src/state/`
5. Criar páginas em `src/pages/`
6. Adicionar rotas em `src/routes/AppRouter.tsx`
7. Ativar feature flag em `src/config/features.ts`
8. Adicionar menu item em `src/components/layout/Sidebar.tsx`

---

## 📞 Suporte

- **Documentação**: Ver `docs/`
- **Changelog**: Ver `CHANGELOG.md`
- **Stack Original**: [PROJETO.md](PROJETO.md), [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)

---

## 📄 Licença

Este projeto é um bundle exportado do Figma com transformações de arquitetura.

---

**Última atualização**: 2026-01-08
**Status**: ETAPA 7 ✅ Completa | Aplicação com 7 ETAPAs Concluídas
