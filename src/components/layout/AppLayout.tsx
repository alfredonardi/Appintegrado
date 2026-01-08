import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

/**
 * AppLayout - Wrapper para todas as páginas
 * Contém:
 * - Sidebar (menu lateral)
 * - Header (barra superior)
 * - Outlet (onde as rotas são renderizadas)
 */
export function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Menu lateral */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Barra superior */}
        <Header />

        {/* Área de conteúdo - rotas aparecem aqui */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
