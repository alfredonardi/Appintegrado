import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './state/auth';
import { AppRouter } from './routes/AppRouter';

/**
 * App - Componente raiz da aplicação
 * Envolve com:
 * - BrowserRouter: ativa React Router
 * - AuthProvider: ativa autenticação mock
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}
