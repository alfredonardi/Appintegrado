import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { CasesListScreen } from './components/screens/CasesListScreen';
import { CaseWorkspaceScreen } from './components/screens/CaseWorkspaceScreen';
import { CaptureAIScreen } from './components/screens/CaptureAIScreen';
import { RecognitionScreen } from './components/screens/RecognitionScreen';
import { PhotoReportScreen } from './components/screens/PhotoReportScreen';
import { InvestigationReportScreen } from './components/screens/InvestigationReportScreen';
import { ExportScreen } from './components/screens/ExportScreen';
import { useCaseStore } from '../store';

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
