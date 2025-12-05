import api, { setAuthToken, removeAuthToken } from './api';
import { LoginCredentials, RegisterData, AuthResponse, User, ApiResponse } from '@/types/api';

export const authService = {
  // Login com email e senha
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/user/login', credentials);

    if (response.data.success && response.data.token) {
      setAuthToken(response.data.token);
    }

    return response.data;
  },

  // Login com Google
  async loginWithGoogle(token: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/user/login_with_google', { token });

    if (response.data.success && response.data.token) {
      setAuthToken(response.data.token);
    }

    return response.data;
  },

  // Login com Facebook
  async loginWithFacebook(data: {
    token: string;
    userId: string;
    email: string;
    name: string;
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/user/login_with_facebook', data);

    if (response.data.success && response.data.token) {
      setAuthToken(response.data.token);
    }

    return response.data;
  },

  // Registro de novo usuário
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/user/register', data);

    if (response.data.success && response.data.token) {
      setAuthToken(response.data.token);
    }

    return response.data;
  },

  // Logout
  logout(): void {
    removeAuthToken();
    window.location.href = '/login';
  },

  // Solicitar reset de senha
  async requestPasswordReset(email: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/user/reset-password', { email });
    return response.data;
  },

  // Verificar OTP
  async verifyOtp(email: string, otp: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/user/verify-otp', { email, otp });
    return response.data;
  },

  // Definir nova senha após reset
  async setNewPassword(email: string, password: string, otp: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/user/new-password', {
      email,
      password,
      otp,
    });
    return response.data;
  },

  // Obter perfil do usuário autenticado
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>('/user/get-profile');
    return response.data;
  },

  // Atualizar perfil do usuário
  async updateProfile(data: Partial<User>): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/user/update-profile', data);
    return response.data;
  },

  // Atualizar foto de perfil
  async updateProfilePicture(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('profile', file);

    const response = await api.post<ApiResponse<{ url: string }>>(
      '/user/update-profile-pic',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Alterar senha
  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/user/update-password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  // Obter informações do plano atual
  async getPlanInfo(): Promise<ApiResponse<{ plan: string; expires: string; features: string[] }>> {
    const response = await api.get<ApiResponse<{ plan: string; expires: string; features: string[] }>>(
      '/user/plan-info'
    );
    return response.data;
  },

  // Verificar se token é válido
  async verifyToken(): Promise<ApiResponse<{ valid: boolean; user?: User }>> {
    const response = await api.get<ApiResponse<{ valid: boolean; user?: User }>>('/user/verify-token');
    return response.data;
  },

  // Atualizar timezone do usuário
  async updateTimezone(timezone: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/user/update-timezone', { timezone });
    return response.data;
  },
};
