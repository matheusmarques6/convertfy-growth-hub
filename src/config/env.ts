export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3010/api',
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3010',
  appName: import.meta.env.VITE_APP_NAME || 'Convertfy CRM',
} as const;
