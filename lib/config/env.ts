/**
 * Velithra API Client - Environment Configuration
 * Next.js uses process.env instead of import.meta.env
 */

export const ENV = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5233/api',
  SIGNALR_HUB_URL: process.env.NEXT_PUBLIC_SIGNALR_HUB_URL || 'http://localhost:5233/hubs',
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Velithra',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;

export default ENV;
