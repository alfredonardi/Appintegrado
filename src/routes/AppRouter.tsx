import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { PrivateRoute } from '../components/routes/PrivateRoute';
import { FEATURE_FLAGS } from '../config/features';

// Pages - Cases
import { Login } from '../pages/Login';
import { CasesListScreen } from '../pages/CasesListScreen';
import { CaseWorkspaceScreen } from '../pages/CaseWorkspaceScreen';
import { CaptureAIScreen } from '../pages/CaptureAIScreen';
import { RecognitionScreen } from '../pages/RecognitionScreen';
import { PhotoReportScreen } from '../pages/PhotoReportScreen';
import { InvestigationReportScreen } from '../pages/InvestigationReportScreen';
import { ExportScreen } from '../pages/ExportScreen';

// Pages - Clients (ETAPA 7)
import { ClientsList } from '../pages/Clients/List';
import { ClientsCreate } from '../pages/Clients/Create';
import { ClientsEdit } from '../pages/Clients/Edit';

/**
 * AppRouter - Configuração central de rotas da aplicação
 *
 * Rotas Públicas:
 * /login                   → Login (autenticação mock)
 *
 * Rotas Protegidas (requerem autenticação):
 * /                        → Redireciona para /cases
 * /cases                   → Listagem de casos (se casesModule ativado)
 * /cases/:caseId           → Workspace/editor do caso
 * /cases/:caseId/capture       → Tela de captura com IA
 * /cases/:caseId/recognition   → Tela de reconhecimento
 * /cases/:caseId/photo-report  → Relatório fotográfico
 * /cases/:caseId/investigation → Relatório de investigação
 * /cases/:caseId/export        → Exportação e geração de PDF
 * /clients                 → Listagem de clientes (se clientsModule ativado - ETAPA 7)
 * /clients/new             → Criar novo cliente
 * /clients/:clientId/edit  → Editar cliente
 *
 * Feature Flags:
 * - casesModule: ativa /cases e sub-rotas
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
          {/* Casos - condicionado por feature flag */}
          {FEATURE_FLAGS.casesModule && (
            <>
              <Route path="/cases" element={<CasesListScreen />} />
              <Route path="/cases/:caseId" element={<CaseWorkspaceScreen />} />
              <Route path="/cases/:caseId/capture" element={<CaptureAIScreen />} />
              <Route path="/cases/:caseId/recognition" element={<RecognitionScreen />} />
              <Route path="/cases/:caseId/photo-report" element={<PhotoReportScreen />} />
              <Route path="/cases/:caseId/investigation" element={<InvestigationReportScreen />} />
              <Route path="/cases/:caseId/export" element={<ExportScreen />} />
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
