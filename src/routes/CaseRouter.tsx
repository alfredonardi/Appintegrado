/**
 * CaseRouter - Rotas aninhadas para o workspace de caso (ETAPA 9)
 *
 * Estrutura:
 * /cases/:caseId                    → Redireciona para primeiro módulo ativo
 * /cases/:caseId/capture             → Submódulo de captura
 * /cases/:caseId/recognition         → Submódulo de reconhecimento
 * /cases/:caseId/photo-report        → Submódulo de relatório fotográfico
 * /cases/:caseId/investigation       → Submódulo de relatório de investigação
 * /cases/:caseId/export              → Submódulo de exportação
 *
 * Cada rota é condicionada por feature flags. Se um módulo estiver desativado
 * e o usuário tentar acessá-lo, é redirecionado para o primeiro módulo ativo.
 */

import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FEATURE_FLAGS } from '../config/features';
import { getFirstActiveModule, getActiveModules, isModuleActive } from '../config/caseModules';
import { CaseWorkspaceScreen } from '../pages/CaseWorkspaceScreen';
import { CaptureAIScreen } from '../pages/CaptureAIScreen';
import { RecognitionScreen } from '../pages/RecognitionScreen';
import { PhotoReportModule } from '../pages/CaseModules/PhotoReport';
import { InvestigationReportScreen } from '../pages/InvestigationReportScreen';
import { ExportScreen } from '../pages/ExportScreen';

/**
 * CaseModuleGuard - Componente para proteger rotas de módulos por feature flags
 * Se o módulo não estiver ativo, redireciona para o primeiro ativo
 */
interface CaseModuleGuardProps {
  moduleId: string;
  children: React.ReactNode;
}

function CaseModuleGuard({ moduleId, children }: CaseModuleGuardProps) {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Se o módulo não estiver ativo, redirecionar
    if (!isModuleActive(moduleId)) {
      const firstActive = getFirstActiveModule();

      if (firstActive) {
        navigate(`/cases/${caseId}/${firstActive.path}`, { replace: true });
      } else {
        // Se nenhum módulo estiver ativo, redirecionar para lista de casos
        navigate('/cases', { replace: true });
      }
    }
  }, [moduleId, caseId, navigate]);

  // Se módulo está ativo, renderizar children
  if (isModuleActive(moduleId)) {
    return <>{children}</>;
  }

  // Retornar null enquanto redireciona
  return null;
}

/**
 * CaseRouter - Componente raiz das rotas de caso
 * Integrado em AppRouter.tsx como:
 * <Route path="/cases/:caseId/*" element={<CaseRouter />} />
 */
export function CaseRouter() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  // Se nenhum módulo ativo, redirecionar para /cases
  const firstActiveModule = getFirstActiveModule();

  return (
    <Routes>
      {/* Rota raiz /cases/:caseId → redireciona para primeiro módulo ativo */}
      <Route
        path="/"
        element={
          firstActiveModule ? (
            <Navigate to={`/cases/${caseId}/${firstActiveModule.path}`} replace />
          ) : (
            <Navigate to="/cases" replace />
          )
        }
      />

      {/* Submódulo de Captura */}
      {FEATURE_FLAGS.captureModule && (
        <Route
          path="/capture"
          element={
            <CaseModuleGuard moduleId="capture">
              <CaptureAIScreen />
            </CaseModuleGuard>
          }
        />
      )}

      {/* Submódulo de Reconhecimento */}
      {FEATURE_FLAGS.recognitionModule && (
        <Route
          path="/recognition"
          element={
            <CaseModuleGuard moduleId="recognition">
              <RecognitionScreen />
            </CaseModuleGuard>
          }
        />
      )}

      {/* Submódulo de Relatório Fotográfico */}
      {FEATURE_FLAGS.photoReportModule && (
        <Route
          path="/photo-report"
          element={
            <CaseModuleGuard moduleId="photo-report">
              <PhotoReportModule />
            </CaseModuleGuard>
          }
        />
      )}

      {/* Submódulo de Relatório de Investigação */}
      {FEATURE_FLAGS.investigationModule && (
        <Route
          path="/investigation"
          element={
            <CaseModuleGuard moduleId="investigation">
              <InvestigationReportScreen />
            </CaseModuleGuard>
          }
        />
      )}

      {/* Submódulo de Exportação */}
      {FEATURE_FLAGS.exportModule && (
        <Route
          path="/export"
          element={
            <CaseModuleGuard moduleId="export">
              <ExportScreen />
            </CaseModuleGuard>
          }
        />
      )}

      {/* 404 em caso de rota inválida → redireciona para primeiro módulo ativo */}
      <Route
        path="*"
        element={
          firstActiveModule ? (
            <Navigate to={`/cases/${caseId}/${firstActiveModule.path}`} replace />
          ) : (
            <Navigate to="/cases" replace />
          )
        }
      />
    </Routes>
  );
}
