import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { connectSocket } from '@/services/socket';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'agent';
}

export const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { isAuthenticated, user, token, fetchProfile } = useAuthStore();
  const location = useLocation();

  // Buscar perfil e conectar socket se necessário
  useEffect(() => {
    if (token && !user) {
      fetchProfile();
      connectSocket();
    }
  }, [token, user, fetchProfile]);

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Se requer role específica e o usuário não tem
  if (requiredRole && user && user.role !== requiredRole) {
    // Redirecionar para dashboard padrão se não tem permissão
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Componente para rotas de admin
export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  return <PrivateRoute requiredRole="admin">{children}</PrivateRoute>;
};

// Componente para rotas de agente
export const AgentRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  // Agentes e usuários/admins podem acessar
  if (user && (user.role === 'agent' || user.role === 'admin' || user.role === 'user')) {
    return <>{children}</>;
  }

  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};
