# Appintegrado - App Escalável para Investigação Forense

Bundle exportado do Figma transformado em uma aplicação React/Vite escalável, com estrutura profissional, feature flags, autenticação mock e API abstrata.

## 📋 Status de Transformação

- ✅ **ETAPA 1**: Diagnóstico inicial e plano
- ✅ **ETAPA 2**: Estrutura app-ready (pages, components, services)
- ✅ **ETAPA 3**: React Router + Layout base
- ⏳ **ETAPA 4**: Auth mock + proteção de rotas (próximo)
- ⏳ **ETAPA 5**: Feature flags
- ⏳ **ETAPA 6**: Camada de API + mocks alternável
- ⏳ **ETAPA 7**: Primeiro CRUD (Clientes)

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

### 🔲 Planejados (Próximas ETAPAs)
- **React Router** com rotas e URLs (ETAPA 3)
- **Autenticação Mock** com proteção de rotas (ETAPA 4)
- **Feature Flags** para ativar/desativar módulos (ETAPA 5)
- **Camada de API** abstrata com mocks alternáveis (ETAPA 6)
- **Módulo CRUD** simples (Clientes) como exemplo (ETAPA 7)

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

## ⚙️ Configuração (Futuro)

### Feature Flags (ETAPA 5)

Criar `src/config/features.ts`:

```typescript
export const FEATURE_FLAGS = {
  auth: true,
  dashboard: true,
  clientsModule: false,  // Desativar módulo de clientes
  reportsModule: false,
};
```

### Variáveis de Ambiente

Criar `.env` para controlar flags:

```
VITE_FEATURE_CLIENTS=true
VITE_FEATURE_REPORTS=false
VITE_USE_MOCK_API=true
```

---

## 🔐 Autenticação (Futuro - ETAPA 4)

- **Mock Login**: qualquer email/senha aceita
- **Proteção de Rotas**: PrivateRoute wrapper
- **Session**: token salvo em localStorage
- **Logout**: limpa session

```typescript
// Será implementado em ETAPA 4
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

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

1. **Ler [docs/roadmap.md](docs/roadmap.md)** para entender sequência de ETAPAs
2. **Fazer ETAPA 3** (React Router + Layout)
3. **Fazer ETAPA 4** (Auth Mock)
4. **Fazer ETAPA 5** (Feature Flags)
5. **Fazer ETAPA 6** (API abstrata)
6. **Fazer ETAPA 7** (Primeiro CRUD)

Cada ETAPA termina com:
- ✅ `npm run dev` rodando
- ✅ Nenhuma quebra de funcionalidade
- ✅ Novo recurso implementado
- ✅ Documentação atualizada

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
**Status**: ETAPA 2 ✅ Completa | ETAPA 3 ⏳ Próximo
