// api.types · contratos de respuesta, paginación y error de la API
// conecta con: api/client, api/health
// src/api/types/api.types.ts

/**
 * Envoltorio estándar de respuesta del Backend (Swagger: response.APIResponse)
 */
export interface APIResponse<T = unknown> {
  success: boolean
  message: string
  data: T
  meta?: PaginatorMetadata
  error?: string
}

/**
 * Metadatos de paginación oficial del Backend (Swagger: response.PaginatorMetadata)
 */
export interface PaginatorMetadata {
  currentPage: number
  pageSize: number
  totalRecords: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * Error estandarizado de la aplicación para captura en UI y servicios
 */
export interface AppApiError {
  status: number
  message: string
  userFriendlyMessage: string
  details?: unknown
  timestamp: string
}

/**
 * Resultado de diagnóstico de conexión y salud del backend
 */
export interface HealthCheckResult {
  isConnected: boolean
  latencyMs: number
  message: string
  timestamp: string
  statusCode?: number
  errorDetails?: string
}
