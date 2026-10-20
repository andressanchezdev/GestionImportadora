// config · URL base, timeout y endpoints del backend
// conecta con: api/client, api/health
// src/api/config.ts

/**
 * Configuración maestra de la API (Backend en Railway)
 */
export const API_CONFIG = {
  BASE_URL:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
    'https://importadora-back-production.up.railway.app',
  TIMEOUT: 15000, // 15 segundos
  // URL del websocket de tiempo real; vacía = tiempo real desactivado (no se conecta a ningún servidor por defecto)
  WS_URL: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WS_URL) || '',
  ENDPOINTS: {
    // Autenticación
    AUTH: {
      LOGIN: '/auth/login',
      REFRESH: '/auth/refresh',
    },
    // Catálogo de Productos e Inventario
    PRODUCTS: {
      LIST: '/products',
      SEARCH: '/inventory/search',
      FILTER: '/inventory/filter',
      CONTROL: '/inventory/control',
      CREATE: '/inventory/createProduct',
    },
    // POS / Carrito de Ventas
    CARTS: {
      GET: '/carts',
      REGISTER_ITEM: '/carts/register',
      DELETE_ALL: '/carts/deleteall',
    },
    // Catálogos Base
    CATALOGS: {
      CATEGORIES: '/categories',
      BRANDS: '/brands',
      BRANDS_UPDATE: '/brands/update',
      MODELS: '/models',
      WAREHOUSES: '/warehouses',
    },
    // Cartera y Crédito
    WALLET: {
      BASE: '/wallet',
      INTERNAL: '/wallet/internal',
      HISTORY: '/wallet/history',
    },
    // Ventas y Pipeline de Surtido
    SALES: {
      PENDINGS: '/sales/pendings',
      TRASLADES: '/sales/traslades',
      HISTORY: '/sales/history',
    },
    // Empleados y Permisos
    EMPLOYEES: {
      BASE: '/employees',
      LIST: '/employees/list',
      ROLES: '/employees/roles',
      PERMISSIONS: '/employees/permissions',
    },
    // Salud del backend (GET, sin sesión y muy liviano: unos 220 bytes)
    HEALTH: {
      CHECK: '/health',
      READINESS: '/readiness',
    },
    // Verificación / Documentación Swagger
    DOCS: {
      SWAGGER_DOC: '/swagger/doc.json',
    },
  },
} as const

export default API_CONFIG
