import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { PrivateRoute } from '../components/routes/PrivateRoute';
import { FEATURE_FLAGS } from '../config/features';
import { CaseRouter } from './CaseRouter';

// Pages - Login
import { Login } from '../pages/Login';

// Pages - Cases (ETAPA 8 - CRUD, ETAPA 9 - Submódulos)
import { CasesListScreen } from '../pages/CasesListScreen';
import { CasesList } from '../pages/Cases/List';
import { CasesEdit } from '../pages/Cases/Edit';

// Pages - Clients (ETAPA 7)
import { ClientsList } from '../pages/Clients/List';
import { ClientsCreate } from '../pages/Clients/Create';
import { ClientsEdit } from '../pages/Clients/Edit';

/**
 * AppRouter - Configuração central de rotas da aplicação (ETAPA 9 - Submódulos)
 *
 * Rotas Públicas:
 * /login                   → Login (autenticação mock)
 *
 * Rotas Protegidas (requerem autenticação):
 * /                        → Redireciona para /cases
 * /cases                   → Listagem de casos (se casesModule ativado)
 * /cases/new               → Criar novo caso (ETAPA 8)
 * /cases/:caseId           → Redireciona para primeiro módulo ativo (ETAPA 9)
 * /cases/:caseId/edit      → Editar caso (ETAPA 8)
 * /cases/:caseId/capture             → Submódulo de captura e IA (com feature guard)
 * /cases/:caseId/recognition         → Submódulo de reconhecimento (com feature guard)
 * /cases/:caseId/photo-report        → Submódulo de relatório fotográfico (com feature guard)
 * /cases/:caseId/investigation       → Submódulo de relatório de investigação (com feature guard)
 * /cases/:caseId/export              → Submódulo de exportação (com feature guard)
 * /clients                 → Listagem de clientes (se clientsModule ativado - ETAPA 7)
 * /clients/new             → Criar novo cliente
 * /clients/:clientId/edit  → Editar cliente
 *
 * Feature Flags:
 * - casesModule: ativa /cases e sub-rotas
 * - captureModule: ativa submódulo de captura
 * - recognitionModule: ativa submódulo de reconhecimento
 * - photoReportModule: ativa submódulo de relatório fotográfico
 * - investigationModule: ativa submódulo de relatório de investigação
 * - exportModule: ativa submódulo de exportação
 * - clientsModule: ativa /clients e sub-rotas (ETAPA 7)
 */
export function AppRouter() {
  return (
    <Routes>
      {/* Rota raiz redireciona para /cases */}
      <Route path="/" element={<Navigate to="/cases" replace />} />

      {/* Rota Pública - Login */}
      <Route path="/login" element={<Login />} />

      {/* Rotas Protegidas - requerem autenticação */}
      <Route element={<PrivateRoute />}>
        {/* Layout wrapper que contém Sidebar e Header */}
        <Route element={<AppLayout />}>
          {/* Casos - condicionado por feature flag (ETAPA 9 - Submódulos) */}
          {FEATURE_FLAGS.casesModule && (
            <>
              {/* Listagem de casos */}
              <Route path="/cases" element={<CasesListScreen />} />
              <Route path="/cases/new" element={<CasesList />} />
              <Route path="/cases/:caseId/edit" element={<CasesEdit />} />

              {/* Workspace do caso com rotas aninhadas e submódulos (ETAPA 9) */}
              <Route path="/cases/:caseId/*" element={<CaseRouter />} />
            </>
          )}

          {/* Clientes - condicionado por feature flag (ETAPA 7) */}
          {FEATURE_FLAGS.clientsModule && (
            <>
              <Route path="/clients" element={<ClientsList />} />
              <Route path="/clients/new" element={<ClientsCreate />} />
              <Route path="/clients/:clientId/edit" element={<ClientsEdit />} />
            </>
          )}
        </Route>
      </Route>

      {/* 404 - redireciona para home */}
      <Route path="*" element={<Navigate to="/cases" replace />} />
    </Routes>
  );
}
