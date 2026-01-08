import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';

// Pages
import { CasesListScreen } from '../pages/CasesListScreen';
import { CaseWorkspaceScreen } from '../pages/CaseWorkspaceScreen';
import { CaptureAIScreen } from '../pages/CaptureAIScreen';
import { RecognitionScreen } from '../pages/RecognitionScreen';
import { PhotoReportScreen } from '../pages/PhotoReportScreen';
import { InvestigationReportScreen } from '../pages/InvestigationReportScreen';
import { ExportScreen } from '../pages/ExportScreen';

/**
 * AppRouter - Configuração central de rotas da aplicação
 *
 * Rotas:
 * /                        → Redireciona para /cases
 * /cases                   → Listagem de casos
 * /cases/:id               → Workspace/editor do caso
 * /cases/:id/capture       → Tela de captura com IA
 * /cases/:id/recognition   → Tela de reconhecimento
 * /cases/:id/photo-report  → Relatório fotográfico
 * /cases/:id/investigation → Relatório de investigação
 * /cases/:id/export        → Exportação e geração de PDF
 */
export function AppRouter() {
  return (
    <Routes>
      {/* Rota raiz redireciona para /cases */}
      <Route path="/" element={<Navigate to="/cases" replace />} />

      {/* Layout wrapper que contém Sidebar e Header */}
      <Route element={<AppLayout />}>
        {/* Listagem de casos */}
        <Route path="/cases" element={<CasesListScreen />} />

        {/* Caso específico - Workspace */}
        <Route path="/cases/:caseId" element={<CaseWorkspaceScreen />} />

        {/* Modulos do caso */}
        <Route path="/cases/:caseId/capture" element={<CaptureAIScreen />} />
        <Route path="/cases/:caseId/recognition" element={<RecognitionScreen />} />
        <Route path="/cases/:caseId/photo-report" element={<PhotoReportScreen />} />
        <Route path="/cases/:caseId/investigation" element={<InvestigationReportScreen />} />
        <Route path="/cases/:caseId/export" element={<ExportScreen />} />
      </Route>

      {/* 404 - redireciona para home */}
      <Route path="*" element={<Navigate to="/cases" replace />} />
    </Routes>
  );
}
