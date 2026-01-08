import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';

/**
 * App - Componente raiz da aplicação
 * Envolve toda a app com BrowserRouter para ativar React Router
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
