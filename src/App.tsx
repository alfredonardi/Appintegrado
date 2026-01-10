import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './state/auth';
import { AppRouter } from './routes/AppRouter';

/**
 * App - Componente raiz da aplicacao
 * Envolve com:
 * - BrowserRouter: ativa React Router
 * - AuthProvider: ativa autenticacao Nhost
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