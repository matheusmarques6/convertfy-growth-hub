import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config/env';
import { ApiResponse } from '@/types/api';

// Criar instância do Axios
const api: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request - Adicionar token JWT
api.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response - Tratar erros e logout
api.interceptors.response.use(
  (response) => {
    // Verificar se a API está pedindo logout
    if (response.data?.logout === true) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    // Erro de rede ou servidor
    if (!error.response) {
      console.error('Erro de rede:', error.message);
      return Promise.reject(new Error('Erro de conexão com o servidor'));
    }

    // Erro 401 - Não autorizado
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Erro com mensagem da API
    const message = error.response.data?.msg || 'Erro desconhecido';
    return Promise.reject(new Error(message));
  }
);

export default api;

// Helper functions para gerenciar token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};
