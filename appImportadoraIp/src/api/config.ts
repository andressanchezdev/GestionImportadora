// config · URL base, timeout y endpoints del backend
// conecta con: api/client, api/health; scripts/check-endpoints.mjs revisa que cada ruta exista en el Swagger (npm run check:api)
// ojo: aquí viven TODAS las rutas (ninguna escrita suelta en un service). Todos los listados del backend son POST con { companyId, page, pageSize, ... } y responden { data, meta }
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
      LOGOUT: '/auth/logout',
    },
    // Productos, búsqueda e inventario de lectura
    PRODUCTS: {
      LIST: '/products',
      REGISTER: '/products/register',
      SEARCH: '/inventory/search',
      FILTER: '/inventory/filter',
      CONTROL: '/inventory/control',
      CREATE: '/inventory/createProduct',
    },
    // Búsqueda universal (varias entidades a la vez)
    SEARCH: {
      UNIVERSAL: '/search',
    },
    // POS / Carrito de Ventas
    CARTS: {
      GET: '/carts',
      REGISTER_ITEM: '/carts/register',
      UPDATE: '/carts/update', // cambia la cantidad de un ítem { cartId, quantity }
      DELETE: '/carts/delete', // borra un ítem y devuelve su stock { cartId }
      DELETE_ALL: '/carts/deleteall',
      REASSIGN_USER: '/carts/reassignuser',
    },
    // Catálogos Base
    CATALOGS: {
      CATEGORIES: '/categories',
      CATEGORIES_REGISTER: '/categories/register',
      CATEGORIES_UPDATE: '/categories/update',
      BRANDS: '/brands',
      BRANDS_REGISTER: '/brands/register',
      BRANDS_UPDATE: '/brands/update',
      MODELS: '/models',
      MODELS_REGISTER: '/models/register',
      MODELS_UPDATE: '/models/update',
      WAREHOUSES: '/warehouses',
      WAREHOUSES_REGISTER: '/warehouses/register',
      WAREHOUSES_UPDATE: '/warehouses/update',
    },
    // Terceros: usuarios (clientes y vendedores), su crédito, direcciones y descuentos
    USERS: {
      LIST: '/users',
      BY_ID: (id: number | string) => `/users/${id}`,
      REGISTER: '/users/register',
      QUICK_REGISTER: '/users/quick-register',
      UPDATE: '/users/update',
      STATE: '/users/state',
      VALIDATE_DOCUMENT: '/users/validate-document',
      BALANCE: '/users/balance',
      CREDIT: '/users/credit',
      CREDIT_DAYS: '/users/credit/days',
      CREDIT_LIMIT: '/users/credit/limit',
    },
    CUSTOMERS: {
      REGISTER: '/customers/register',
      CHECK_EMAIL: '/customers/check-email',
      FAVORITES: '/customers/favorites',
      UPDATE_FAVORITE: '/customers/update-favorite',
      UPDATE_DETAILS: '/customers/update-details',
      UPDATE_COMPANIES: '/customers/update-companies',
      UPDATE_PHOTO: '/customers/update-photo',
      UPDATE_DOCUMENT: '/customers/update-document',
      DELETE_DOCUMENT: '/customers/delete-document',
    },
    DIRECTIONS: {
      LIST: '/directions',
      REGISTER: '/directions/register',
      UPDATE: '/directions/update',
      DELETE: '/directions/delete',
    },
    DISCOUNTS: {
      LIST: '/discounts',
      REGISTER: '/discounts/register',
      UPDATE: '/discounts/update',
      DELETE: '/discounts/delete',
      DELETE_ALL: '/discounts/deleteall',
      DISABLE_ALL: '/discounts/disabledall',
    },
    // Cartera y Crédito
    WALLET: {
      BASE: '/wallet',
      SUMMARY: '/wallet/summary',
      INTERNAL: '/wallet/internal',
      HISTORY: '/wallet/history',
    },
    PAYMENTS: {
      LIST: '/payments',
      REGISTER: '/payments/register',
      ADVANCE: '/payments/advance',
      EARLY: '/payments/early',
      BY_SALE: '/payments/by-sale',
      DETAIL: '/payments/detail',
      SUMMARY: '/payments/summary',
      CHANGE_STATUS: '/payments/changestatus',
      CANCELLED: '/payments/cancelled',
    },
    // Ventas y Pipeline de Surtido
    SALES: {
      REGISTER: '/sales/register',
      PENDINGS: '/sales/pendings',
      HISTORY: '/sales/history',
      DETAIL: '/sales/detail',
      SUMMARY: '/sales/summary',
      STATUS: '/sales/status',
      CANCEL: '/sales/cancel',
      APPROVED: '/sales/approved',
      TRASLADES: '/sales/traslades',
      TRASLADES_REJECT: '/sales/traslades/reject',
      REPORT_GENERAL: '/sales/report/general',
      REPORT_INTERNAL: '/sales/report/internal',
    },
    ORDERS: {
      LIST: '/orders',
    },
    // Reportes
    REPORTS: {
      SALES: '/reports/sales',
      CUSTOMERS: '/reports/customers',
      FINANCIAL: '/reports/financial',
      INVENTORY: '/reports/inventory',
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
    // Documentación Swagger (es el archivo del Swagger, no una ruta de la API; no lo consume la app)
    DOCS: {
      SWAGGER_DOC: '/swagger/doc.json',
    },
  },
} as const

export default API_CONFIG
