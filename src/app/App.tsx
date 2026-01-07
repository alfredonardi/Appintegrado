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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('cases');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'cases':
        return <CasesListScreen onNavigate={setCurrentScreen} />;
      case 'workspace':
        return <CaseWorkspaceScreen onNavigate={setCurrentScreen} />;
      case 'capture':
        return <CaptureAIScreen />;
      case 'recognition':
        return <RecognitionScreen />;
      case 'photo-report':
        return <PhotoReportScreen />;
      case 'investigation-report':
        return <InvestigationReportScreen />;
      case 'export':
        return <ExportScreen />;
      default:
        return <CasesListScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}
