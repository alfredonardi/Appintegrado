import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { CasesListScreen } from './pages/CasesListScreen';
import { CaseWorkspaceScreen } from './pages/CaseWorkspaceScreen';
import { CaptureAIScreen } from './pages/CaptureAIScreen';
import { RecognitionScreen } from './pages/RecognitionScreen';
import { PhotoReportScreen } from './pages/PhotoReportScreen';
import { InvestigationReportScreen } from './pages/InvestigationReportScreen';
import { ExportScreen } from './pages/ExportScreen';
import { useCaseStore } from './state';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('cases');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const selectedCaseId = useCaseStore((state) => state.selectedCaseId);

  // Função de navegação que verifica se há caso selecionado
  const handleNavigate = (screen: string) => {
    // Para telas que requerem caso selecionado
    const requiresCase = ['workspace', 'capture', 'recognition', 'photo-report', 'investigation-report', 'export'];

    if (requiresCase.includes(screen) && !selectedCaseId) {
      // Se não há caso selecionado, vai para a lista de casos
      setCurrentScreen('cases');
      return;
    }

    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'cases':
        return <CasesListScreen onNavigate={handleNavigate} />;
      case 'workspace':
        return <CaseWorkspaceScreen onNavigate={handleNavigate} />;
      case 'capture':
        return <CaptureAIScreen onNavigate={handleNavigate} />;
      case 'recognition':
        return <RecognitionScreen onNavigate={handleNavigate} />;
      case 'photo-report':
        return <PhotoReportScreen onNavigate={handleNavigate} />;
      case 'investigation-report':
        return <InvestigationReportScreen onNavigate={handleNavigate} />;
      case 'export':
        return <ExportScreen onNavigate={handleNavigate} />;
      default:
        return <CasesListScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar onNavigate={handleNavigate} />
        <main className="flex-1 overflow-auto">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}
