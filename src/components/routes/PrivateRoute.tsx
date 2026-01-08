import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../state/auth';

/**
 * PrivateRoute - Wrapper para proteger rotas
 *
 * Redireciona para /login se não estiver autenticado
 * Renderiza a rota se estiver autenticado
 *
 * Uso:
 * <Route element={<PrivateRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 */
export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Se está carregando, mostrar loading (opcional)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se está autenticado, renderizar as rotas
  return <Outlet />;
}
