// src/api/client.ts
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { API_CONFIG } from './config'
import type { APIResponse, AppApiError } from './types/api.types'

/**
 * 1. Instancia Base de Axios configurada para Importadora Premium (Railway)
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/**
 * 2. Interceptor de Petición (Request Interceptor)
 * Inyecta automáticamente el token Bearer si existe en almacenamiento local
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
          : null

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // Entornos seguros o sin acceso a localStorage
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(normalizeError(error)
    )
  }
)

/**
 * 3. Interceptor de Respuesta (Response Interceptor)
 * Valida el envoltorio de la API y centraliza la captura de errores
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<APIResponse<unknown>>) => {
    // Si la API responde HTTP 200 pero el cuerpo indica fallo de negocio
    if (response.data && response.data.success === false) {
      const customError: AppApiError = {
        status: response.status,
        message: response.data.message || 'Error en la respuesta del servidor.',
        userFriendlyMessage:
          response.data.message || 'La operación no pudo ser completada por el servidor.',
        details: response.data.error,
        timestamp: new Date().toISOString(),
      }
      return Promise.reject(customError)
    }

    return response
  },
  (error: AxiosError<APIResponse<unknown>>) => {
    const normalized = normalizeError(error)

    if (normalized.status === 401) {
      console.warn('⚠️ [API Interceptor] Sesión expirada o token no autorizado (401).')
    }

    return Promise.reject(normalized)
  }
)

/**
 * 4. Normalizador de Errores: Traduce cualquier fallo técnico a formato legible
 */
export function normalizeError(error: AxiosError<any>): AppApiError {
  // Caso 1: Error de red o timeout (el servidor no contestó)
  if (!error.response) {
    const isTimeout = error.code === 'ECONNABORTED'
    return {
      status: 0,
      message: error.message || 'Error de conexión',
      userFriendlyMessage: isTimeout
        ? 'El servidor tardó demasiado en responder (Tiempo de espera agotado). Por favor intenta de nuevo.'
        : 'No fue posible conectar con el servidor de Importadora Premium. Verifica tu conexión a internet o el estado del backend.',
      details: error.code,
      timestamp: new Date().toISOString(),
    }
  }

  // Caso 2: El servidor respondió con código HTTP de error
  const { status, data } = error.response
  const serverMessage = data?.message || data?.error || error.message

  let userFriendly = 'Ocurrió un error inesperado al procesar la solicitud.'

  switch (status) {
    case 400:
      userFriendly = serverMessage || 'Los datos enviados son inválidos. Por favor verifica los campos.'
      break
    case 401:
      userFriendly = 'Tu sesión ha expirado o no estás autorizado. Por favor ingresa de nuevo.'
      break
    case 403:
      userFriendly = 'No tienes permisos suficientes para realizar esta acción en el sistema.'
      break
    case 404:
      userFriendly = 'El recurso solicitado no fue encontrado en el servidor.'
      break
    case 500:
    case 502:
    case 503:
      userFriendly =
        'Error interno en el servidor de Railway. Los ingenieros han sido alertados.'
      break
    default:
      userFriendly = serverMessage || userFriendly
  }

  return {
    status,
    message: serverMessage,
    userFriendlyMessage: userFriendly,
    details: data?.error || data,
    timestamp: new Date().toISOString(),
  }
}

export default apiClient
