# ROADMAP DE TRANSFORMAÇÃO - Appintegrado

**Objetivo Final**: App escalável, ativável feature-by-feature, com auth mock, feature flags e API mock.

---

## ETAPA 1 ✅ DIAGNÓSTICO INICIAL E PLANO

**Status**: ✅ COMPLETO

**Entregáveis**:
- ✅ `docs/diagnostico.md` - Análise completa da estrutura atual
- ✅ `docs/roadmap.md` - Este documento
- ✅ App roda sem erros: `npm run dev` ✅
- ✅ Stack identificada: React 18 + Vite + Zustand + Tailwind
- ✅ Problemas mapeados: sem router, sem auth, sem feature flags

**Critério de Pronto**: ✅ Documentação e diagnóstico prontos

**Próximo**: ETAPA 2

---

## ETAPA 2 — Estrutura do Projeto "App-Ready"

**Objetivo**: Reorganizar arquivos em estrutura escalável mantendo tudo funcionando.

**O que fazer**:

```
Criar pastas:
✓ src/pages/          (telas mapeadas para rotas)
✓ src/components/     (reorganizar UI e componentes reutilizáveis)
✓ src/routes/         (configuração de rotas)
✓ src/services/       (camada de serviços e API)
✓ src/state/          (contextos e stores)
✓ src/config/         (configurações e feature flags)
✓ src/types/          (tipos TypeScript)
✓ src/assets/         (imagens, ícones, etc.)
✓ src/hooks/          (custom hooks)
✓ src/utils/          (utilitários)
✓ src/constants/      (constantes)
✓ src/mocks/          (dados fake para desenvolvimento)

Reorganizar:
- Mover screens/ → pages/
- Mover App.tsx components (Sidebar, Topbar) → components/layout/
- Mover caseStore.ts → state/
- Mover services → services/
- Mover types → types/
- Mover helpers → utils/
- Mover constants → constants/
```

**Imports ajustados**:
- Usar alias `@/` para imports (se vite.config suportar)
- Atualizar todos os imports relativos

**Critério de Pronto**:
- ✅ App continua rodando: `npm run dev`
- ✅ Nenhuma tela quebrada
- ✅ Zustand store ainda persiste
- ✅ Build sem erros: `npm run build`

---

## ETAPA 3 — Router + Layout Base

**Objetivo**: Implementar React Router com rotas e layout reutilizável.

**O que fazer**:

```bash
npm install react-router-dom
```

**Criar**:
- `src/routes/AppRouter.tsx` - Configuração central de rotas
- `src/components/layout/AppLayout.tsx` - Layout wrapper com Sidebar + Topbar
- `src/components/layout/Sidebar.tsx` - Menu reutilizável
- `src/components/layout/Header.tsx` - Barra superior reutilizável

**Rotas iniciais**:
```
/                           → Home (redirect to /dashboard)
/login                      → Login page
/dashboard                  → Dashboard (casos)
/settings                   → Configurações
/cases                      → Listagem de casos
/cases/:id                  → Detalhes/workspace do caso
/cases/:id/capture          → Tela de captura
/cases/:id/recognition      → Tela de reconhecimento
/cases/:id/photo-report     → Relatório fotográfico
/cases/:id/investigation    → Relatório de investigação
/cases/:id/export           → Exportação
```

**Layout base**:
```
<AppLayout>
  <Sidebar>
    - Menu principal
    - Links ativos baseado em location
  </Sidebar>
  <div className="flex-1">
    <Header>
      - Logo / breadcrumb
      - User menu
    </Header>
    <main>
      <Outlet />  ← Rotas renderizadas aqui
    </main>
  </div>
</AppLayout>
```

**Critério de Pronto**:
- ✅ Navegar entre rotas sem crash
- ✅ URL muda: `/cases` → `/cases/123` → `/dashboard`
- ✅ Layout (Sidebar + Header) aparece em todas as páginas
- ✅ `npm run dev` funciona

---

## ETAPA 4 — Auth Mock + Proteção de Rotas

**Objetivo**: Criar autenticação fake com contexto e proteger rotas.

**O que fazer**:

**Criar**:
- `src/state/auth/AuthContext.tsx` - Context com login/logout
- `src/state/auth/useAuth.ts` - Custom hook
- `src/components/routes/PrivateRoute.tsx` - Guard de rotas
- `src/pages/Login.tsx` - Página de login

**AuthContext**:
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login(email: string, password: string): Promise<void>;
  logout(): void;
}

// Mock: qualquer email/senha válida
// Salva token fake em localStorage
```

**PrivateRoute**:
```typescript
// Se não logado → redireciona para /login
// Se logado → renderiza página
```

**Rotas protegidas**:
- `/dashboard` - PrivateRoute
- `/cases` - PrivateRoute
- `/settings` - PrivateRoute
- `/login` - PUBLIC

**Login page**:
- Form com email + password
- Mock aceita qualquer coisa
- Salva token em localStorage
- Redireciona para /dashboard

**Critério de Pronto**:
- ✅ Sem login: `/dashboard` → redireciona para `/login`
- ✅ Login com email/senha qualquer → acessa `/dashboard`
- ✅ Logout limpa localStorage e redireciona
- ✅ Refresh página: stay logged (token em localStorage)

---

## ETAPA 5 — Feature Flags (Ativação Step-by-Step)

**Objetivo**: Poder ligar/desligar funcionalidades sem remover código.

**O que fazer**:

**Criar**:
- `src/config/features.ts` - Configuração de flags
- `src/hooks/useFeature.ts` - Custom hook para verificar flag
- `src/components/FeatureGuard.tsx` - Componente wrapper
- `.env.example` - Documentar variáveis

**Features.ts**:
```typescript
export const FEATURE_FLAGS = {
  auth: true,              // Autenticação ativa
  dashboard: true,         // Dashboard visível
  clientsModule: false,    // Módulo de clientes (ativaremos em ETAPA 7)
  reportsModule: false,    // Relatórios
  settingsModule: true,    // Configurações
  analyticsModule: false,  // Analytics
};

// Override via .env:
// VITE_FEATURE_CLIENTS=true
// VITE_FEATURE_REPORTS=true
```

**FeatureGuard.tsx**:
```typescript
<FeatureGuard feature="clientsModule">
  <ClientsPage />
</FeatureGuard>
```

**Router com flags**:
```typescript
// Rotas condicionadas a flags
const routes = [
  ...publicRoutes,
  ...authRoutes,
  ...(FEATURE_FLAGS.clientsModule ? [clientsRoutes] : []),
  ...(FEATURE_FLAGS.reportsModule ? [reportsRoutes] : []),
];
```

**Menu condicional**:
```typescript
{FEATURE_FLAGS.clientsModule && <MenuItem to="/clients" />}
{FEATURE_FLAGS.reportsModule && <MenuItem to="/reports" />}
```

**Critério de Pronto**:
- ✅ Desativar `dashboard: false` → rota `/dashboard` desaparece
- ✅ Menu item "Clientes" aparece/desaparece com flag
- ✅ `.env` controla flags em tempo de build
- ✅ Documentação no README

---

## ETAPA 6 — Camada de API + Mock Alternável

**Objetivo**: Abstrair dados de UI, com mocks alternáveis via .env.

**O que fazer**:

**Criar**:
- `src/services/apiClient.ts` - Cliente HTTP com modo mock
- `src/services/mock/` - Dados fake
  - `mockClients.ts` - Clientes fake
  - `mockCases.ts` - Casos fake
  - `mockUsers.ts` - Usuários fake
- `src/services/api/` - Implementações reais (futura)
- `src/services/clientsService.ts` - Service de clientes
- `src/services/casesService.ts` - Service de casos
- `src/services/authService.ts` - Service de auth

**.env**:
```
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3000
```

**apiClient.ts**:
```typescript
const isUseMock = import.meta.env.VITE_USE_MOCK_API === 'true';

if (isUseMock) {
  // Return mock data
} else {
  // Call real API
}
```

**Example - clientsService.ts**:
```typescript
export async function listClients() {
  // Usa apiClient internamente
  // Se VITE_USE_MOCK_API=true → retorna mock
  // Se false → faz fetch real
}
```

**Critério de Pronto**:
- ✅ Dashboard mostra dados (de mock ou API)
- ✅ Trocar `VITE_USE_MOCK_API` funciona
- ✅ `npm run dev` com mock=true funciona
- ✅ Serviços têm função consistente (fetch/cache)

---

## ETAPA 7 — Primeiro Vertical Slice (CRUD Clientes)

**Objetivo**: Implementar módulo completo (listar, criar, editar, deletar) como exemplo.

**O que fazer**:

**1. Ativar feature flag**:
```typescript
clientsModule: true  // em src/config/features.ts
```

**2. Criar páginas**:
- `src/pages/Clients/List.tsx` - Tabela de clientes
- `src/pages/Clients/Create.tsx` - Form criação
- `src/pages/Clients/Edit.tsx` - Form edição
- `src/pages/Clients/Detail.tsx` - Detalhes (opcional)

**3. Rotas**:
```typescript
/clients              → List
/clients/new         → Create
/clients/:id         → Edit
/clients/:id/detail  → Detail (opcional)
```

**4. Zustand store** (ou context para clientes):
```typescript
interface ClientsStore {
  clients: Client[];
  selectedClientId: string | null;

  listClients(): Promise<void>;
  getClient(id: string): Client | null;
  createClient(data: Omit<Client, 'id'>): Promise<string>;
  updateClient(id: string, data: Partial<Client>): Promise<void>;
  deleteClient(id: string): Promise<void>;
}

// Usa clientsService internamente (mock ou real)
```

**5. Implementação de memória**:
- Dados em localStorage (useEffect no mount)
- Criar/editar/deletar altera store
- Persistir em localStorage via Zustand

**6. Menu + Sidebar**:
```typescript
{FEATURE_FLAGS.clientsModule && (
  <SidebarItem to="/clients" icon={<Users />} label="Clientes" />
)}
```

**7. Testes manuais**:
- [ ] Listar clientes (page load)
- [ ] Criar novo cliente (form + submit)
- [ ] Editar cliente (atualiza tabela)
- [ ] Deletar cliente (remove da lista)
- [ ] Refresh página → dados persistem (localStorage)

**Critério de Pronto**:
- ✅ Listar clientes funcionando
- ✅ Criar novo cliente (salva em memória + localStorage)
- ✅ Editar cliente (atualiza lista)
- ✅ Deletar cliente (remove)
- ✅ Desativar flag `clientsModule: false` → desaparece
- ✅ `npm run dev` funciona
- ✅ Build production funciona

---

## RESUMO DA TRANSFORMAÇÃO

| Etapa | Título | Duração Est. | Status |
|-------|--------|-------------|--------|
| 1 | Diagnóstico | ✅ Feito | ✅ Completo |
| 2 | Estrutura app-ready | 30min | ⏳ Próximo |
| 3 | Router + Layout | 45min | - |
| 4 | Auth mock | 30min | - |
| 5 | Feature flags | 30min | - |
| 6 | API mock layer | 45min | - |
| 7 | CRUD clientes | 45min | - |
| **TOTAL** | | ~3.5h | - |

---

## RESULTADO FINAL

**Ao terminar ETAPA 7, o projeto terá**:

✅ Estrutura padronizada (pages, components, services, routes, state, config, types)
✅ React Router com rotas e URLs reais
✅ Layout base reutilizável (sidebar, header)
✅ Autenticação mock com proteção de rotas
✅ Feature flags para ativar/desativar módulos
✅ Camada de API abstrata com mocks alternáveis
✅ Primeiro CRUD funcional (clientes)
✅ Documentação completa (README + CHANGELOG)
✅ App rodando e escalável para novos features

---

## COMO USAR ESTE ROADMAP

1. Leia a ETAPA que vai fazer
2. Crie branches: `git checkout -b etapa-N`
3. Siga o "O que fazer"
4. Teste no `npm run dev`
5. Faça commit: `git commit -m "ETAPA N: descrição"`
6. Vá para próxima etapa

**Regra de ouro**: Cada ETAPA termina com `npm run dev` rodando ✅
