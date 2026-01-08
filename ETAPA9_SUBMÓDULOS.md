# ETAPA 9 - Submódulos de Caso com Feature Flags

## Visão Geral

A ETAPA 9 implementa um sistema de **submódulos ativáveis por feature flags** para o workspace de caso, com:

- ✅ **Roteamento aninhado** inteligente (`/cases/:caseId/*`)
- ✅ **Feature flags** para cada submódulo (capture, recognition, photo-report, investigation, export)
- ✅ **Redirecionamento automático** quando módulo está desativado
- ✅ **Sidebar dinâmico** que mostra apenas módulos ativos
- ✅ **Proteção de rotas** via `CaseModuleGuard`

---

## Arquitetura

### 1. Configuração de Módulos (`src/config/caseModules.ts`)

Define a lista de submódulos e funções auxiliares:

```typescript
// CASE_MODULES - Array com metadados dos módulos
CASE_MODULES = [
  { id: 'capture', label: 'Captura & IA', path: 'capture', featureFlag: 'captureModule', ... },
  { id: 'recognition', label: 'Reconhecimento', path: 'recognition', featureFlag: 'recognitionModule', ... },
  // ... outros módulos
]

// Funções helpers
getActiveModules()           // Retorna módulos com feature flag ativada
getFirstActiveModule()       // Primeiro módulo ativo (para redirecionamento)
isModuleActive(moduleId)     // Verifica se módulo está ativo
getModuleById(moduleId)      // Obtém módulo por ID
getNextActiveModule(current) // Próximo módulo na sequência
```

### 2. Router de Casos (`src/routes/CaseRouter.tsx`)

Implementa rotas aninhadas com proteção:

```typescript
// Rotas:
/cases/:caseId/               → Redireciona para primeiro módulo ativo
/cases/:caseId/capture        → CaptureAIScreen (com proteção)
/cases/:caseId/recognition    → RecognitionScreen (com proteção)
/cases/:caseId/photo-report   → PhotoReportScreen (com proteção)
/cases/:caseId/investigation  → InvestigationReportScreen (com proteção)
/cases/:caseId/export         → ExportScreen (com proteção)

// CaseModuleGuard - componente wrapper:
- Se módulo está ativo → renderiza children
- Se desativado → redireciona para primeiro ativo
- Se nenhum ativo → redireciona para /cases
```

### 3. Sidebar Dinâmico (`src/components/case/CaseSidebar.tsx`)

Menu que renderiza apenas módulos ativos:

```typescript
<CaseSidebar />       // Desktop: sidebar com w-64
<CaseSidebarMobile /> // Mobile: botões compactos
```

Integração:

```typescript
// Em uma página de caso:
import { CaseSidebar } from '../components/case/CaseSidebar';

export function MyCasePage() {
  return (
    <div className="flex">
      <CaseSidebar /> {/* Menu de módulos */}
      <div className="flex-1">
        {/* Conteúdo da página */}
      </div>
    </div>
  );
}
```

---

## Feature Flags

### Definição

Todas as feature flags já existem em `src/config/features.ts`:

```typescript
// Em features.ts:
captureModule: boolean           // Captura & IA
recognitionModule: boolean       // Reconhecimento
photoReportModule: boolean       // Relatório Fotográfico
investigationModule: boolean     // Relatório de Investigação
exportModule: boolean            // Exportação
```

### Defaults

Todos os módulos têm **default `true`** em `src/config/features.ts`:

```typescript
const DEFAULT_FEATURES: Record<FeatureFlagKey, boolean> = {
  // ...
  captureModule: true,
  recognitionModule: true,
  photoReportModule: true,
  investigationModule: true,
  exportModule: true,
};
```

### Override via `.env`

Para desativar submódulos, crie um arquivo `.env` na raiz:

```bash
# Desativa capture
VITE_FEATURE_CAPTURE_MODULE=false

# Desativa recognition
VITE_FEATURE_RECOGNITION_MODULE=false

# Desativa photo-report
VITE_FEATURE_PHOTO_REPORT_MODULE=false

# Etc...
```

Reinicie o servidor dev (`npm run dev`) para aplicar as mudanças.

---

## Testes Manuais

### Teste 1: Desativar Todos os Módulos

```bash
# .env
VITE_FEATURE_CAPTURE_MODULE=false
VITE_FEATURE_RECOGNITION_MODULE=false
VITE_FEATURE_PHOTO_REPORT_MODULE=false
VITE_FEATURE_INVESTIGATION_MODULE=false
VITE_FEATURE_EXPORT_MODULE=false
```

Esperado:
- Acessar `/cases/123` → redireciona para `/cases` (lista de casos)
- Sidebar não mostra submódulos
- ✅ Comportamento correto

### Teste 2: Apenas Capture Ativado

```bash
# .env
VITE_FEATURE_CAPTURE_MODULE=true
VITE_FEATURE_RECOGNITION_MODULE=false
VITE_FEATURE_PHOTO_REPORT_MODULE=false
VITE_FEATURE_INVESTIGATION_MODULE=false
VITE_FEATURE_EXPORT_MODULE=false
```

Esperado:
- Acessar `/cases/123` → redireciona para `/cases/123/capture`
- Sidebar mostra apenas "Captura & IA"
- Tentar acessar `/cases/123/recognition` → redireciona para `/cases/123/capture`
- ✅ Comportamento correto

### Teste 3: Múltiplos Módulos

```bash
# .env
VITE_FEATURE_CAPTURE_MODULE=true
VITE_FEATURE_RECOGNITION_MODULE=true
VITE_FEATURE_PHOTO_REPORT_MODULE=false
VITE_FEATURE_INVESTIGATION_MODULE=false
VITE_FEATURE_EXPORT_MODULE=true
```

Esperado:
- Acessar `/cases/123` → redireciona para `/cases/123/capture` (primeiro ativo)
- Sidebar mostra: "Captura & IA", "Reconhecimento", "Exportar Pacote" (em ordem)
- Clicar em "Reconhecimento" → vai para `/cases/123/recognition`
- Clicar em "Exportar Pacote" → vai para `/cases/123/export`
- Tentar acessar `/cases/123/photo-report` → redireciona para `/cases/123/capture`
- ✅ Comportamento correto

### Teste 4: Toggle Dinâmico

1. Iniciar com todos os módulos ativados
2. Editar `.env` para desativar alguns
3. Recarregar a página (`F5`)
4. Verificar:
   - Sidebar atualiza dynamicamente ✓
   - Rota ativa muda se necessário ✓
   - Sem erros no console ✓

---

## Redirecionamento Inteligente

### Fluxo Detalhado

```
Usuário acessa /cases/:caseId
        ↓
CaseRouter verifica se primeiro módulo ativo existe
        ↓
   SIM: Redireciona para /cases/:caseId/<module.path>
        ↓
   NÃO: Redireciona para /cases (lista)

---

Usuário acessa /cases/:caseId/photo-report (desativado)
        ↓
CaseRouter ativa a rota (existe em FEATURE_FLAGS)
        ↓
CaseModuleGuard verifica se módulo está ativo
        ↓
   INATIVO: Redireciona para primeiro ativo
            ↓
            Ex: /cases/:caseId/capture
        ↓
   ATIVO: Renderiza <PhotoReportScreen />

---

URL inválida /cases/:caseId/invalid
        ↓
Rota 404 em CaseRouter
        ↓
Redireciona para primeiro módulo ativo
```

---

## Integração com AppRouter

O `AppRouter.tsx` agora usa `CaseRouter`:

```typescript
// Em AppRouter.tsx:
import { CaseRouter } from './CaseRouter';

export function AppRouter() {
  return (
    <Routes>
      {/* ... outras rotas ... */}

      {FEATURE_FLAGS.casesModule && (
        <>
          <Route path="/cases" element={<CasesListScreen />} />
          <Route path="/cases/new" element={<CasesList />} />
          <Route path="/cases/:caseId/edit" element={<CasesEdit />} />

          {/* Submódulos com CaseRouter (ETAPA 9) */}
          <Route path="/cases/:caseId/*" element={<CaseRouter />} />
        </>
      )}

      {/* ... outras rotas ... */}
    </Routes>
  );
}
```

---

## Exemplo de Integração em Página de Caso

Se você quiser adicionar o `CaseSidebar` a uma página específica:

```typescript
import { useParams } from 'react-router-dom';
import { CaseSidebar } from '../components/case/CaseSidebar';
import { useSelectedCase } from '../state';

export function MyCasePage() {
  const { caseId } = useParams<{ caseId: string }>();
  const selectedCase = useSelectedCase();

  return (
    <div className="flex gap-6">
      {/* Sidebar com módulos (desktop) */}
      <CaseSidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 p-6">
        <h1>BO {selectedCase?.bo}</h1>
        {/* ... seu conteúdo ... */}
      </div>
    </div>
  );
}
```

---

## Debugging

### Ver Estado das Feature Flags

Abra o console do navegador (`F12`) e procure por:

```
🚩 Feature Flags: { ... }
```

Exemplo:

```javascript
// No console:
// 🚩 Feature Flags: {
//   captureModule: true,
//   recognitionModule: false,
//   photoReportModule: true,
//   investigationModule: false,
//   exportModule: true,
//   ...
// }
```

### Ver Módulos Ativos

```javascript
// No console:
// 📦 Case Modules Config: {
//   allModules: [...],
//   activeModules: [ ... ],
//   firstActive: {...}
// }
```

### Erro: "Módulo desativado mas ainda acessível"

- Verificar `.env` - flags estão corretas?
- Reiniciar dev server (`npm run dev`)
- Limpar cache do navegador (`Ctrl+Shift+Del`)
- Verificar se `CaseModuleGuard` está sendo usado

---

## Estrutura de Arquivos

```
src/
├── config/
│   ├── features.ts          # Feature flags (existente)
│   └── caseModules.ts       # ✨ Novo: Configuração de módulos
│
├── routes/
│   ├── AppRouter.tsx        # ✏️ Atualizado: Usa CaseRouter
│   └── CaseRouter.tsx       # ✨ Novo: Rotas aninhadas
│
├── components/
│   └── case/
│       └── CaseSidebar.tsx  # ✨ Novo: Menu dinâmico
│
├── pages/
│   ├── CaseModules/         # ✨ Novo: Páginas placeholder
│   │   ├── Capture.tsx
│   │   ├── Recognition.tsx
│   │   ├── PhotoReport.tsx
│   │   ├── Investigation.tsx
│   │   └── Export.tsx
│   ├── CaptureAIScreen.tsx  # Existente: Implementação real
│   ├── RecognitionScreen.tsx
│   ├── PhotoReportScreen.tsx
│   ├── InvestigationReportScreen.tsx
│   └── ExportScreen.tsx
```

---

## Próximos Passos

1. **Integrar CaseSidebar** em layouts/páginas de caso
2. **Substituir placeholders** em `src/pages/CaseModules/` por implementações reais
3. **Testes** de feature flags em diferentes combinações
4. **Deploy** em staging com diferentes configurações de flags
5. **Monitor** logs de redirecionamento

---

## Build & Deploy

### Desenvolvimento

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Iniciar dev server
npm run dev

# Editar .env para testar diferentes flags
# Recarregar navegador (F5)
```

### Produção

```bash
# Build
npm run build

# Variáveis de ambiente em deployment:
VITE_FEATURE_CAPTURE_MODULE=true
VITE_FEATURE_RECOGNITION_MODULE=false
# ... etc
```

O build incorpora os valores de `.env` em tempo de build (Vite).

---

## FAQ

**P: Posso ativar/desativar flags em tempo de execução?**
R: Não, as flags são definidas em build time. Para mudanças dinâmicas, seria necessário um sistema adicional.

**P: E se eu tiver um módulo que precisa de 2 flags?**
R: Use `getActiveModules()` customizado ou adicione lógica em `CaseModuleGuard`.

**P: Posso mudar a ordem dos módulos?**
R: Sim, edite o campo `order` em `CASE_MODULES` em `src/config/caseModules.ts`.

**P: O que acontece se usuário favorita `/cases/123/disabled-module`?**
R: `CaseModuleGuard` redireciona automaticamente para o primeiro ativo.

---

## Referências

- [src/config/caseModules.ts](./src/config/caseModules.ts) - Configuração de módulos
- [src/routes/CaseRouter.tsx](./src/routes/CaseRouter.tsx) - Rotas aninhadas
- [src/components/case/CaseSidebar.tsx](./src/components/case/CaseSidebar.tsx) - Menu dinâmico
- [src/config/features.ts](./src/config/features.ts) - Feature flags
- [CHANGELOG.md](./CHANGELOG.md) - Histórico completo
