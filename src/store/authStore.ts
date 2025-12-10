import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/api';
import { authService } from '@/services/auth';
import { connectSocket, disconnectSocket } from '@/services/socket';

interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (token: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, mobile?: string) => Promise<boolean>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login com email e senha
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });

          if (response.success && response.token) {
            set({
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            });

            // Buscar perfil do usuário
            await get().fetchProfile();

            // Conectar Socket.IO
            connectSocket();

            return true;
          } else {
            set({
              error: response.msg || 'Erro ao fazer login',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      // Login com Google OAuth
      loginWithGoogle: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.loginWithGoogle(token);

          if (response.success && response.token) {
            set({
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            });

            await get().fetchProfile();
            connectSocket();

            return true;
          } else {
            set({
              error: response.msg || 'Erro ao fazer login com Google',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      // Registrar novo usuário
      register: async (name: string, email: string, password: string, mobile?: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register({
            name,
            email,
            password,
            mobile_with_country_code: mobile,
            acceptPolicy: true,
          });

          if (response.success) {
            // Backend signup não retorna token, fazer login automático
            const loginSuccess = await get().login(email, password);
            return loginSuccess;
          } else {
            set({
              error: response.msg || 'Erro ao criar conta',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      // Logout
      logout: () => {
        disconnectSocket();
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        window.location.href = '/login';
      },

      // Buscar perfil do usuário
      fetchProfile: async () => {
        try {
          const response = await authService.getProfile();
          if (response.success && response.data) {
            set({ user: response.data });
          }
        } catch (error) {
          console.error('Erro ao buscar perfil:', error);
          // Se o token for inválido, fazer logout
          const errorMessage = error instanceof Error ? error.message : '';
          if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
            get().logout();
          }
        }
      },

      // Atualizar perfil
      updateProfile: async (data: Partial<User>) => {
        try {
          const response = await authService.updateProfile(data);
          if (response.success) {
            // Atualizar o user no estado com os novos dados
            const currentUser = get().user;
            if (currentUser) {
              set({ user: { ...currentUser, ...data } });
            }
            return true;
          }
          return false;
        } catch (error) {
          console.error('Erro ao atualizar perfil:', error);
          return false;
        }
      },

      // Setters
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selector hooks para uso otimizado
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
