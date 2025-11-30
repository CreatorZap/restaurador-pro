// Configurações de ambiente

export const config = {
  // API URL
  apiUrl: import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD 
      ? 'https://seu-dominio.vercel.app/api' 
      : 'http://localhost:3001'),
  
  // Site URL
  siteUrl: import.meta.env.VITE_SITE_URL || 
    (import.meta.env.PROD 
      ? 'https://seu-dominio.vercel.app' 
      : 'http://localhost:3000'),
  
  // Ambiente
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
};
