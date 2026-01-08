# DIAGNÓSTICO INICIAL - Appintegrado

Data: 2026-01-08
Status: ✅ Projeto roda sem erros

---

## 1. STACK DETECTADA

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| React | 18.3.1 | Framework UI |
| Vite | 6.3.5 | Bundler e dev server |
| TypeScript | (via React) | Tipagem |
| Zustand | 5.0.9 | State management |
| Tailwind CSS | 4.1.12 | Styling |
| Radix UI | Diversos | Componentes sem estilo |
| Material-UI (MUI) | 7.3.5 | Componentes estilizados |
| React Hook Form | 7.55.0 | Formulários |
| React Router | ❌ NÃO INSTALADO | - |
| React Beautiful DnD | 13.1.1 | Drag & drop (deprecated) |
| Recharts | 2.15.2 | Gráficos |
| Zustand + localStorage | Middleware | Persistência |

---

## 2. ESTRUTURA ATUAL

```
src/
├── app/
│   ├── App.tsx                          # Componente raiz com navegação manual
│   ├── components/
│   │   ├── screens/                     # 7 telas principais (não são rotas!)
│   │   │   ├── CasesListScreen.tsx
│   │   │   ├── CaseWorkspaceScreen.tsx
│   │   │   ├── CaptureAIScreen.tsx
│   │   │   ├── RecognitionScreen.tsx
│   │   │   ├── PhotoReportScreen.tsx
│   │   │   ├── InvestigationReportScreen.tsx
│   │   │   └── ExportScreen.tsx
│   │   ├── ui/                          # ~50 componentes UI (Radix + custom)
│   │   ├── Sidebar.tsx                  # Menu lateral
│   │   ├── Topbar.tsx                   # Barra superior
│   │   ├── Toast.tsx                    # Notificações
│   │   └── figma/
│   │       └── ImageWithFallback.tsx
│   ├── store/
│   │   ├── caseStore.ts                 # Zustand store (1000+ linhas)
│   │   └── index.ts
│   ├── services/
│   │   ├── pdfService.ts
│   │   ├── exportService.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── case.ts                      # Modelo de dados principal
│   │   ├── fieldRegistry.ts             # Registry de campos canônicos
│   │   └── index.ts
│   ├── helpers/
│   │   ├── caseSelectors.ts
│   │   └── index.ts
│   ├── constants/
│   │   ├── screens.ts
│   │   └── index.ts
│   └── styles/
│       └── index.css
├── main.tsx                             # Entry point
└── (faltam: pages/, routes/, config/)

public/
└── (não listado, usar src/assets)
```

**Total de arquivos**: 73 (principalmente UI components)

---

## 3. ANÁLISE ARQUITETURAL

### ✅ Pontos Positivos

1. **Modelo de dados bem estruturado**: Case type é rico e bem pensado
2. **Zustand com persistência**: Estado global já persiste em localStorage
3. **UI components robustos**: ~50 componentes Radix + custom, bem organizados
4. **TypeScript**: Projeto bem tipado
5. **Tailwind + componentes**: Base de styling pronta
6. **Telas funcionais**: 7 telas complexas já implementadas (screenshot dos Figma)

### ⚠️ Problemas e Gaps

| Problema | Impacto | Prioridade |
|----------|--------|-----------|
| **Sem React Router** | Navegação manual via estado, sem URL mapping | 🔴 Alta |
| **Sem estrutura /pages** | Screens estão em /components, misturado com UI | 🟡 Média |
| **Sem autenticação/auth context** | Não há proteção de rotas nem user session | 🔴 Alta |
| **Sem feature flags** | Impossível ativar/desativar módulos | 🔴 Alta |
| **Sem camada API abstrata** | Services acoplados ao caso específico | 🟡 Média |
| **Sem config/.env** | Valores hardcoded | 🟡 Média |
| **Sem layout base reutilizável** | Layout fixo em App.tsx | 🟡 Média |
| **Sem tests** | Zero testes automatizados | 🟢 Baixa |
| **React Beautiful DnD deprecated** | Aviso de npm (não quebra agora) | 🟢 Baixa |

---

## 4. ONDE ESTÃO OS COMPONENTES/TELAS

**Telas principais (Screens - são páginas, não componentes UI)**:
- `CasesListScreen` - Listagem de casos
- `CaseWorkspaceScreen` - Workspace/editor de caso
- `CaptureAIScreen` - Captura com IA
- `RecognitionScreen` - Reconhecimento de fotos
- `PhotoReportScreen` - Relatório fotográfico
- `InvestigationReportScreen` - Relatório de investigação
- `ExportScreen` - Exportação/PDF

**Componentes reutilizáveis (UI)**:
- Botões, inputs, selects, cards, etc. (50+ no /ui)
- Sidebar, Topbar, Toast

**Lógica de negócio**:
- Zustand store (caseStore.ts) - 1000+ linhas
- Services específicos (pdfService, exportService)
- Helpers (caseSelectors, etc.)

---

## 5. ESTADO ATUAL DO PROJETO

```bash
$ npm run dev
# ✅ Vite ready em http://localhost:5173/
# ✅ Sem erros de compilação
# ✅ App roda e interage
```

**O que funciona**:
- Sidebar com navegação entre screens
- Seleção de casos
- Telas complexas renderizando
- Zustand store persistindo em localStorage

**O que falta para ser "production-ready"**:
- Rotas com URL mapping (users esperam /dashboard, /cases, etc.)
- Auth/login (qualquer um acessa tudo)
- Controle granular de features (ativar/desativar módulos)
- Camada de API separada da UI

---

## 6. RECOMENDAÇÕES IMEDIATAS

✅ **ETAPA 1 (agora)**: Diagnóstico completo ← **VOCÊ ESTÁ AQUI**

**Próximas ETAPAs**:
1. **ETAPA 2**: Reorganizar em estrutura /pages, /components, /services, /routes
2. **ETAPA 3**: Instalar React Router, criar rotas com URLs
3. **ETAPA 4**: Criar AuthContext com mock e PrivateRoute
4. **ETAPA 5**: Adicionar feature flags (src/config/features.ts)
5. **ETAPA 6**: Abstração de API com mocks alternáveis
6. **ETAPA 7**: Primeiro CRUD simples (clientes) como exemplo

---

## 7. COMANDO PARA RODAR

```bash
npm install      # Já feito
npm run dev      # Inicia http://localhost:5173/
npm run build    # Build production
```

---

## 8. PRÓXIMOS PASSOS

➡️ Ver `docs/roadmap.md` para sequência detalhada das ETAPAS 2-7.
