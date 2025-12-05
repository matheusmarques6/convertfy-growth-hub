import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * PublicRoute - Rota para páginas públicas (login, registro, etc.)
 * Redireciona para dashboard se o usuário já estiver autenticado
 */
export const PublicRoute = ({ children, redirectTo = '/dashboard' }: PublicRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  // Se já estiver autenticado, redirecionar
  if (isAuthenticated) {
    // Verificar se tem uma rota de origem para voltar
    const from = (location.state as { from?: string })?.from;
    return <Navigate to={from || redirectTo} replace />;
  }

  return <>{children}</>;
};
