import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { connectSocket } from '@/services/socket';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    fetchProfile,
    updateProfile,
    clearError,
  } = useAuthStore();

  // Ao montar, verificar se tem token e buscar perfil se necessário
  useEffect(() => {
    if (token && !user) {
      fetchProfile();
      connectSocket();
    }
  }, [token, user, fetchProfile]);

  // Redirecionar para login se não autenticado
  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      // Salvar a rota atual para redirecionar após login
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // Redirecionar para dashboard se já autenticado (para uso em páginas de login/registro)
  const redirectIfAuthenticated = useCallback(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: string })?.from || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Login com redirecionamento automático
  const loginWithRedirect = useCallback(
    async (email: string, password: string) => {
      const success = await login(email, password);
      if (success) {
        const from = (location.state as { from?: string })?.from || '/dashboard';
        navigate(from, { replace: true });
      }
      return success;
    },
    [login, navigate, location.state]
  );

  // Registro com redirecionamento automático
  const registerWithRedirect = useCallback(
    async (name: string, email: string, password: string, mobile?: string) => {
      const success = await register(name, email, password, mobile);
      if (success) {
        navigate('/dashboard', { replace: true });
      }
      return success;
    },
    [register, navigate]
  );

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    loginWithGoogle,
    register,
    logout,
    fetchProfile,
    updateProfile,
    clearError,

    // Helpers
    requireAuth,
    redirectIfAuthenticated,
    loginWithRedirect,
    registerWithRedirect,

    // Computed
    isAdmin: user?.role === 'admin',
    isAgent: user?.role === 'agent',
    isUser: user?.role === 'user',
  };
};

// Hook simplificado para verificar se está autenticado
export const useRequireAuth = () => {
  const { requireAuth, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      requireAuth();
    }
  }, [isAuthenticated, isLoading, requireAuth]);

  return { isAuthenticated, isLoading };
};
