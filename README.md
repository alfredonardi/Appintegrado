# Atlas - Casos, Dilig├¬ncias e Evid├¬ncias em um S├│ Lugar

Bundle exportado do Figma transformado em uma aplica├º├úo React/Vite escal├ível, com estrutura profissional, feature flags, autentica├º├úo mock e API abstrata.

## ­ƒôï Status de Transforma├º├úo

- Ô£à **ETAPA 1**: Diagn├│stico inicial e plano
- Ô£à **ETAPA 2**: Estrutura app-ready (pages, components, services)
- Ô£à **ETAPA 3**: React Router + Layout base
- Ô£à **ETAPA 4**: Auth mock + prote├º├úo de rotas
- Ô£à **ETAPA 5**: Feature flags
- Ô£à **ETAPA 6**: Camada de API + mocks altern├ível
- Ô£à **ETAPA 7**: Primeiro CRUD (Clientes)
- Ô£à **ETAPA 8**: Cases CRUD Consolidado (List, Create, Edit + Nhost integration)
- Ô£à **ETAPA 9**: Subm├│dulos de Caso com Feature Flags (Roteamento Aninhado)
- Ô£à **ETAPA 10**: Capture Vertical Slice Completo (Upload e Galeria de Imagens)
- Ô£à **ETAPA 11**: Integra├º├úo Backend (Provider Nhost - GraphQL + Storage)
- Ô£à **ETAPA 12**: Photo Report Vertical Slice (Integrado com Capture)

Veja `docs/roadmap.md` para detalhes de cada etapa.

---

## ­ƒÜÇ Quick Start

### Instala├º├úo

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abre em `http://localhost:5173/`

### Build Produ├º├úo

```bash
npm run build
```

### Teste R├ípido - Photo Report (ETAPA 12)

1. **Iniciar servidor**:
   ```bash
   npm run dev
   ```

2. **Login** (credenciais dummy - qualquer email/senha v├ílidos):
   - Email: `admin@test.com`
   - Senha: `123456`

3. **Criar/Acessar caso**:
   - Clicar em "Casos" no sidebar
   - Selecionar um caso existente ou criar novo

4. **Upload de imagens no Capture**:
   - Ir para subm├│dulo "Captura & IA"
   - Fazer upload de 3+ imagens (ou usar imagens de teste)
   - As imagens s├úo armazenadas com Data URLs em localStorage

5. **Criar Relat├│rio no Photo Report**:
   - Ir para subm├│dulo "Relat├│rio Fotogr├ífico"
   - Grid ├á esquerda mostra imagens dispon├¡veis
   - Adicionar 2-3 imagens ao relat├│rio (coluna direita)
   - Editar legenda de cada imagem
   - Testar bot├Áes "Subir" e "Descer" para reordenar
   - Remover uma imagem com bot├úo "X"

6. **Verificar persist├¬ncia**:
   - Fazer F5 (refresh da p├ígina)
   - Dados do relat├│rio devem estar preservados no localStorage
   - Imagens adicionadas, legendas e ordem mant├¬m-se

7. **Validar build**:
   ```bash
   npm run build
   ```
   - Deve completar sem erros (bundle size ~634KB)

---

## ­ƒôü Estrutura do Projeto

```
src/
Ôö£ÔöÇÔöÇ pages/                      # Telas/p├íginas da aplica├º├úo
Ôöé   Ôö£ÔöÇÔöÇ CasesListScreen.tsx     # Lista de casos
Ôöé   Ôö£ÔöÇÔöÇ CaseWorkspaceScreen.tsx # Workspace do caso
Ôöé   Ôö£ÔöÇÔöÇ CaptureAIScreen.tsx     # Captura com IA
Ôöé   Ôö£ÔöÇÔöÇ RecognitionScreen.tsx   # Reconhecimento de fotos
Ôöé   Ôö£ÔöÇÔöÇ PhotoReportScreen.tsx   # Relat├│rio fotogr├ífico
Ôöé   Ôö£ÔöÇÔöÇ InvestigationReportScreen.tsx  # Relat├│rio de investiga├º├úo
Ôöé   ÔööÔöÇÔöÇ ExportScreen.tsx        # Exporta├º├úo/PDF
Ôöé
Ôö£ÔöÇÔöÇ components/                 # Componentes reutiliz├íveis
Ôöé   Ôö£ÔöÇÔöÇ layout/
Ôöé   Ôöé   Ôö£ÔöÇÔöÇ Sidebar.tsx         # Menu lateral
Ôöé   Ôöé   Ôö£ÔöÇÔöÇ Topbar.tsx          # Barra superior
Ôöé   Ôöé   ÔööÔöÇÔöÇ Toast.tsx           # Notifica├º├Áes
Ôöé   ÔööÔöÇÔöÇ ui/                     # ~50 componentes primitivos
Ôöé       Ôö£ÔöÇÔöÇ button.tsx
Ôöé       Ôö£ÔöÇÔöÇ input.tsx
Ôöé       Ôö£ÔöÇÔöÇ card.tsx
Ôöé       ÔööÔöÇÔöÇ ... (Radix UI + custom)
Ôöé
Ôö£ÔöÇÔöÇ state/                      # Estado global (Zustand)
Ôöé   Ôö£ÔöÇÔöÇ caseStore.ts           # Store de casos
Ôöé   ÔööÔöÇÔöÇ index.ts               # Exports
Ôöé
Ôö£ÔöÇÔöÇ services/                   # Servi├ºos e API
Ôöé   Ôö£ÔöÇÔöÇ pdfService.ts          # Gera├º├úo de PDFs
Ôöé   Ôö£ÔöÇÔöÇ exportService.ts       # Exporta├º├úo
Ôöé   ÔööÔöÇÔöÇ mock/                  # (Futura) Dados fake
Ôöé
Ôö£ÔöÇÔöÇ types/                      # Tipos TypeScript
Ôöé   Ôö£ÔöÇÔöÇ case.ts                # Modelo de dados principal
Ôöé   Ôö£ÔöÇÔöÇ fieldRegistry.ts       # Registry de campos can├┤nicos
Ôöé   ÔööÔöÇÔöÇ index.ts
Ôöé
Ôö£ÔöÇÔöÇ utils/                      # Utilit├írios
Ôöé   Ôö£ÔöÇÔöÇ figma/                 # Utilit├írios do Figma
Ôöé   ÔööÔöÇÔöÇ ...
Ôöé
Ôö£ÔöÇÔöÇ config/                     # (Futura) Configura├º├Áes globais
Ôö£ÔöÇÔöÇ hooks/                      # (Futura) Custom hooks
Ôö£ÔöÇÔöÇ constants/                  # Constantes da aplica├º├úo
Ôö£ÔöÇÔöÇ assets/                     # Imagens, ├¡cones
Ôö£ÔöÇÔöÇ styles/                     # CSS global
Ôöé
Ôö£ÔöÇÔöÇ App.tsx                     # Componente raiz
ÔööÔöÇÔöÇ main.tsx                    # Entry point
```

---

## ­ƒÅù´©Å Stack T├®cnico

| Tecnologia | Vers├úo | Uso |
|-----------|--------|-----|
| **React** | 18.3.1 | Framework UI |
| **Vite** | 6.3.5 | Bundler & Dev Server |
| **TypeScript** | - | Tipagem est├ítica |
| **Zustand** | 5.0.9 | State management |
| **Tailwind CSS** | 4.1.12 | Styling |
| **Radix UI** | Latest | Componentes sem estilo |
| **Material-UI** | 7.3.5 | Componentes estilizados |
| **React Hook Form** | 7.55.0 | Formul├írios |
| **Recharts** | 2.15.2 | Gr├íficos |

---

## ­ƒôû Documenta├º├úo

### Diagn├│stico e Roadmap
- **[docs/diagnostico.md](docs/diagnostico.md)** - An├ílise da estrutura atual e problemas identificados
- **[docs/roadmap.md](docs/roadmap.md)** - Sequ├¬ncia de trabalho por ETAPA
- **[CHANGELOG.md](CHANGELOG.md)** - Hist├│rico de mudan├ºas

### Guias Originais (Figma)
- **[PROJETO.md](PROJETO.md)** - Escopo e vis├úo geral
- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Design system e componentes
- **[GUIA_RAPIDO.md](GUIA_RAPIDO.md)** - Guia r├ípido de uso

---

## ­ƒöä Features Implementados

### Ô£à Atuais
- **Zustand Store** com persist├¬ncia em localStorage
- **7 Telas complexas** funcionando (Cases, Workspace, Capture, Recognition, Photo Report, Investigation, Export)
- **~50 Componentes UI** reutiliz├íveis
- **TypeScript** com tipos bem definidos
- **Tailwind CSS** para estiliza├º├úo
- **Modelo de dados robusto** com auditoria integrada
- **React Router v6** com URL-based routing e nested routes
- **Autentica├º├úo Mock** com session persistence em localStorage
- **Prote├º├úo de Rotas** com PrivateRoute guard
- **Feature Flags** para ativar/desativar m├│dulos via config ou .env
- **useFeature Hook** para verificar flags em componentes
- **FeatureGuard Component** para condicionar rendering por flag
- **API Client** centralizado (ETAPA 6)
- **Services abstratos** para Casos, Clientes, Autentica├º├úo (ETAPA 6)
- **Test Data** com 2 casos, 3 clientes, 5 usu├írios para desenvolvimento (ETAPA 6)
- **M├│dulo CRUD Completo de Clientes** (ETAPA 7):
  - Listagem com filtros por status
  - Cria├º├úo de novo cliente
  - Edi├º├úo de cliente existente
  - Deleta├º├úo com confirma├º├úo
  - Store Zustand com persist├¬ncia
  - Integrado com services layer

- **M├│dulo CRUD Completo de Cases** (ETAPA 8):
  - Listagem de casos
  - Cria├º├úo de novo caso
  - Edi├º├úo de caso existente
  - Deleta├º├úo com confirma├º├úo
  - Store Zustand com persist├¬ncia
  - Integrado com Nhost backend

- **Subm├│dulos de Caso com Feature Flags** (ETAPA 9):
  - Roteamento aninhado `/cases/:caseId/*`
  - 5 subm├│dulos: Capture, Recognition, Photo Report, Investigation, Export
  - Redirecionamento inteligente baseado em feature flags
  - Sidebar din├ómico mostrando apenas m├│dulos ativos

- **Capture Vertical Slice Completo** (ETAPA 10):
  - Upload m├║ltiplo de imagens com drag-drop
  - Galeria com previews responsiva
  - Persist├¬ncia com Data URLs em localStorage
  - Integrado com Nhost backend
  - CRUD de imagens por caso

- **Integra├º├úo Backend** (ETAPA 11):
  - Provider Nhost com GraphQL e Storage
  - Backend com tabelas cases, clients, photo_report_items
  - Storage para case-images

- **Photo Report Vertical Slice** (ETAPA 12):
  - Sele├º├úo de imagens capturadas do Capture
  - Adi├º├úo ao relat├│rio com legenda
  - Reordena├º├úo via bot├Áes (subir/descer)
  - Remo├º├úo de itens
  - Persist├¬ncia autom├ítica via Zustand
  - Integrado com Capture e multi-provider

### ­ƒö▓ Pr├│ximas Implementa├º├Áes
- Integra├º├úo com PDF generation para Photo Report
- Drag-and-drop reordena├º├úo (quando react-beautiful-dnd atualizado)
- Integra├º├úo Investigation (relacionar fotos a se├º├Áes de relat├│rio)
- Implementar outros m├│dulos (Relat├│rios, Analytics, etc)

---

## ­ƒôØ Modelo de Dados Principal

### Case (Caso de Investiga├º├úo)

```typescript
interface Case {
  id: string;                    // UUID
  bo: string;                    // Boletim de Ocorr├¬ncia
  natureza: string;              // Ex: Homic├¡dio, Roubo
  status: CaseStatus;            // rascunho | em_revisao | finalizado
  dataHoraFato: string;          // ISO date
  endereco: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
  circunscricao: string;
  unidade: string;

  // Campos can├┤nicos
  fieldValues: FieldValue[];     // Array de valores estruturados

  // Fotos de evid├¬ncia
  photos: PhotoEvidence[];

  // Extra├º├Áes IA
  aiExtractions: AIExtraction[];

  // Equipe
  team: TeamMember[];

  // Timeline de eventos
  events: TimelineEvent[];

  // Relat├│rios
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

## ­ƒøá´©Å Como Usar (Desenvolvimento)

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

## ÔÜÖ´©Å Configura├º├úo

### Camada de Serviços (ETAPA 6) Ô£à Implementado

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
await clientsService.createClient({ name: 'Jo├úo', email: 'joao@example.com', ... });
await clientsService.deleteClient('client-001');

// Autentica├º├úo
import { authService } from '@/services/authService';

const { token, user } = await authService.login('user@example.com', 'password');
await authService.logout();
await authService.register({ name, email, password, role });
```

### Feature Flags (ETAPA 5) Ô£à Implementado

Arquivo `src/config/features.ts` j├í criado com feature flags:

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

### Data Provider Configuration (Nhost)
Configure o provider de dados Nhost:
```env
# Nhost (backend)
VITE_DATA_PROVIDER=nhost
VITE_NHOST_AUTH_URL=https://<subdomain>.auth.<region>.nhost.run/v1
VITE_NHOST_GRAPHQL_URL=https://<subdomain>.graphql.<region>.nhost.run/v1
# Opcional
# VITE_NHOST_STORAGE_URL=https://<subdomain>.storage.<region>.nhost.run/v1
# VITE_NHOST_FUNCTIONS_URL=https://<subdomain>.functions.<region>.nhost.run/v1
```

### Vari├íveis de Ambiente

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
VITE_DATA_PROVIDER=nhost
VITE_NHOST_AUTH_URL=https://<subdomain>.auth.<region>.nhost.run/v1
VITE_NHOST_GRAPHQL_URL=https://<subdomain>.graphql.<region>.nhost.run/v1
# Optional
# VITE_NHOST_STORAGE_URL=https://<subdomain>.storage.<region>.nhost.run/v1
# VITE_NHOST_FUNCTIONS_URL=https://<subdomain>.functions.<region>.nhost.run/v1
```

**Nota**: Vari├íveis com prefix `VITE_FEATURE_` fazem override dos defaults em `src/config/features.ts`.

---

## ­ƒöÉ Autentica├º├úo (ETAPA 4) Ô£à Implementado

- **Mock Login**: qualquer email/senha n├úo-vazia aceita (arquivo `src/pages/Login.tsx`)
- **Prote├º├úo de Rotas**: PrivateRoute wrapper (`src/components/routes/PrivateRoute.tsx`)
- **Session Persistence**: token + user salvo em localStorage
- **Logout**: limpa session e redireciona para login
- **AuthContext**: gerencia autentica├º├úo global (`src/state/auth/AuthContext.tsx`)

**Como usar:**

```typescript
// Em componentes
import { useAuth } from '@/state/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Ol├í, {user?.name}</p>}
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
- Senha: qualquer (n├úo vazia)

---

## ­ƒôª Depend├¬ncias Principais

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

## ­ƒÉø Problemas Conhecidos

1. **React Beautiful DnD deprecated** - npm warning (n├úo quebra)
   - Refatorar para react-dnd em release futura

2. **Bundle size > 500KB** - Vite warning (previs├¡vel)
   - Implementar code-splitting em ETAPA 3+

3. **Sem testes automatizados** - Implementar em fase 2

---

## ­ƒôÜ Pr├│ximos Passos

## ­ƒô© M├│dulo Capture (ETAPA 10)

### Upload e Galeria de Imagens

O m├│dulo Capture implementa um vertical slice completo com upload m├║ltiplo, preview em grid e persist├¬ncia.

#### Testando Capture com Backend (6 Passos R├ípidos)

O m├│dulo Capture funciona com o provider Nhost.


##### Pré-requisitos
- Backend Nhost configurado
- Variáveis de ambiente configuradas em `.env.local`


##### 6 Passos de Teste

```bash
# PASSO 1: Configurar variáveis de ambiente
# Editar .env.local:
VITE_DATA_PROVIDER=nhost
VITE_NHOST_AUTH_URL=https://seu-projeto.auth.region.nhost.run/v1
VITE_NHOST_GRAPHQL_URL=https://seu-projeto.graphql.region.nhost.run/v1

# PASSO 2: Iniciar app em desenvolvimento
npm run dev

# PASSO 3: Navegar para módulo Capture
# - Ir para http://localhost:5173/cases
# - Clicar em um caso existente
# - Clicar em "Captura de Imagens"

# PASSO 4: Testar Upload
# - Selecionar 2-3 imagens (PNG, JPG, WebP, GIF - máx 10MB cada)
# - Confirmar: imagens aparecem na galeria em ~2-3 segundos
# - Verificar console: logs [CaptureModule] e [CaptureStore]

# PASSO 5: Testar Persistência e Delete
# - F5 (refresh page)
# - Confirmar: imagens persistem (carregadas do backend)
# - Clicar em uma imagem para deletar
# - F5 novamente: imagem removida não reaparece
```

##### Verificação Técnica

**Console Esperado (sucesso)**:
```
[Provider] Data provider configured: {provider: "nhost", ...}
[CaptureModule] Imagens carregadas: 2
[CaptureStore] Upload de imagens concluído com sucesso
```

##### Troubleshooting

| Problema | Solução |
|----------|----------|
| `Error: Provider not initialized` | Verificar configuração das variáveis de ambiente |
| Upload nunca completa | Verificar conectividade com backend e configuração de storage |
| Imagens não persistem após refresh | Verificar configuração do Nhost |
| Erro ao deletar | Verificar permissões de storage no Nhost |

---

### Desenvolvimento Futuro

1. **Implementar M├│dulos Adicionais**
   - Relat├│rios (reportsModule)
   - Analytics (analyticsModule)
   - Seguir mesmo padr├úo da ETAPA 7 (Pages, Store, Services)

2. **Integrar com API Real**
   - Implementar endpoints da API backend
   - Substituir mock data por chamadas HTTP reais

3. **Melhorias de UX/Design**
   - Adicionar pagina├º├úo nas listas
   - Implementar busca e filtros avan├ºados
   - Valida├º├úo de CPF/CNPJ
   - Loading states mais elaborados

4. **Testing**
   - Testes unit├írios dos stores
   - Testes de componentes
   - Testes de integra├º├úo

5. **Capture & IA (ETAPA 11+)**
   - Integra├º├úo com IA para classifica├º├úo autom├ítica
   - OCR para extrair texto de documentos
   - Associar imagens ao relat├│rio fotogr├ífico

### Padr├úo de Desenvolvimento

Cada novo m├│dulo/CRUD deve seguir o padr├úo estabelecido:
1. Criar tipos em `src/types/`
2. Criar mock data em `src/services/mock/`
3. Criar service em `src/services/`
4. Criar store em `src/state/`
5. Criar p├íginas em `src/pages/`
6. Adicionar rotas em `src/routes/AppRouter.tsx`
7. Ativar feature flag em `src/config/features.ts`
8. Adicionar menu item em `src/components/layout/Sidebar.tsx`

---

## ­ƒô× Suporte

- **Documenta├º├úo**: Ver `docs/`
- **Changelog**: Ver `CHANGELOG.md`
- **Stack Original**: [PROJETO.md](PROJETO.md), [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)

---

## ­ƒôä Licen├ºa

Este projeto ├® um bundle exportado do Figma com transforma├º├Áes de arquitetura.

---

**├Ültima atualiza├º├úo**: 2026-01-09
**Status**: ETAPA 13 Ô£à Renomea├º├úo para Atlas | Aplica├º├úo com 13 ETAPAs Conclu├¡das